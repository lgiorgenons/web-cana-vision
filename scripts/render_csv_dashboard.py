"""Gera um dashboard dinâmico combinando a imagem true color e índices exportados em CSV.

Cada CSV precisa conter as colunas 'longitude', 'latitude' e 'value', como produzido
por ``render_index_map.py --csv-output`` ou ``export_indices_csv.py``. A imagem real é
montada a partir dos GeoTIFF (banda R/G/B) informados.
"""
from __future__ import annotations

import argparse
import base64
import io
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Tuple

import folium
import numpy as np
import rasterio
from branca.element import MacroElement, Template
from rasterio.features import rasterize

from render_index_map import (  # type: ignore
    PreparedRaster,
    _apply_overlay_mask,
    _apply_smoothing,
    _apply_unsharp_mask,
    _collect_overlays,
    _generate_rgba,
    _upsample_raster,
    build_map,
)
from render_csv_map import _load_csv_grid, _build_grid, _expand_to_clip_bounds  # type: ignore


def _prepare_raster_from_array(
    data: np.ndarray,
    transform,
    overlay_geojsons,
    clip_bounds,
    name: str,
) -> PreparedRaster:
    bounds = rasterio.transform.array_bounds(data.shape[0], data.shape[1], transform)
    return PreparedRaster(
        data=data,
        transform=transform,
        bounds=bounds,
        clip_bounds=clip_bounds,
        overlay_geojsons=list(overlay_geojsons),
        index_name=name,
    )


def _prepare_from_csv(
    csv_path: Path,
    overlay_geojsons,
    clip_bounds,
    *,
    clip: bool,
    upsample: float,
    sharpen: bool,
    sharpen_radius: float,
    sharpen_amount: float,
    smooth_radius: float,
) -> PreparedRaster:
    lons, lats, values = _load_csv_grid(csv_path)
    grid, transform = _build_grid(lons, lats, values)
    data = grid
    if sharpen:
        data = _apply_unsharp_mask(data, radius=sharpen_radius, amount=sharpen_amount)
    if overlay_geojsons and clip:
        data = _apply_overlay_mask(data, transform, overlay_geojsons)
    if clip and clip_bounds is not None:
        data, transform = _expand_to_clip_bounds(data, transform, clip_bounds)
    data, transform = _upsample_raster(data, transform, upsample)
    data = _apply_smoothing(data, smooth_radius)
    if overlay_geojsons and clip and upsample > 1.0:
        data = _apply_overlay_mask(data, transform, overlay_geojsons)
    return _prepare_raster_from_array(data, transform, overlay_geojsons, clip_bounds, csv_path.stem)


def _prepare_truecolor(
    red_path: Path,
    green_path: Path,
    blue_path: Path,
    overlay_geojsons,
    clip_bounds,
    *,
    clip: bool,
    sharpen: bool,
    sharpen_radius: float,
    sharpen_amount: float,
) -> Tuple[PreparedRaster, Tuple[float, float, float, float]]:
    with rasterio.open(red_path) as red_src, rasterio.open(green_path) as green_src, rasterio.open(blue_path) as blue_src:
        red = red_src.read(1).astype(np.float32)
        green = green_src.read(1).astype(np.float32)
        blue = blue_src.read(1).astype(np.float32)
        transform = red_src.transform
        bounds = red_src.bounds

    data = np.stack([red, green, blue], axis=0)
    data = np.clip(data / 10000.0, 0, 1)
    rgb = np.transpose(data, (1, 2, 0))
    if sharpen:
        rgb = _apply_unsharp_mask(rgb, radius=sharpen_radius, amount=sharpen_amount)
    raster = _prepare_raster_from_array(rgb[:, :, 0], transform, overlay_geojsons, clip_bounds, "truecolor_r")
    return raster, bounds


def _create_iframe_from_map(map_obj: folium.Map) -> str:
    buf = io.BytesIO()
    map_obj.save(buf, close_file=False)
    html = buf.getvalue().decode("utf-8")
    buf.close()
    return html


def _build_layer_map(
    prepared: PreparedRaster,
    cmap: str,
    vmin: Optional[float],
    vmax: Optional[float],
    opacity: float,
    tiles: str,
    tile_attr: Optional[str],
) -> folium.Map:
    layer_map = folium.Map(location=[0, 0], zoom_start=11, tiles=tiles if tiles.lower() != "none" else None, attr=tile_attr)
    bounds = prepared.bounds if prepared.clip_bounds is None else prepared.clip_bounds
    min_lat = min(bounds[1], bounds[3])
    max_lat = max(bounds[1], bounds[3])
    min_lon = min(bounds[0], bounds[2])
    max_lon = max(bounds[0], bounds[2])
    layer_map.fit_bounds([[min_lat, min_lon], [max_lat, max_lon]])

    image, vmin_val, vmax_val = _generate_rgba(prepared.data, cmap, vmin, vmax, opacity)
    folium.raster_layers.ImageOverlay(
        image=image,
        bounds=[[min_lat, min_lon], [max_lat, max_lon]],
        opacity=1.0,
        name=prepared.index_name,
    ).add_to(layer_map)

    for geojson_data in prepared.overlay_geojsons:
        folium.GeoJson(data=geojson_data, name="Area de interesse", style_function=lambda _: {"fillOpacity": 0}).add_to(layer_map)

    layer_map.add_child(folium.LayerControl())
    return layer_map


def _create_dashboard_html(layer_html_map: Dict[str, str], width: str = "100%", height: str = "600px") -> str:
    tabs_html = "".join(
        f"<li><a href='#{key}'>{key}</a></li>" for key in layer_html_map.keys()
    )
    content_html = "".join(
        f"<div id='{key}' class='tab-content'>{html}</div>" for key, html in layer_html_map.items()
    )
    template = f"""
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <title>Dashboard Índices Sentinel-2</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 0; padding: 0; }}
        .tabs {{ list-style: none; margin: 0; padding: 0; display: flex; background: #2b3d4f; }}
        .tabs li {{ flex: 1; }}
        .tabs a {{
            display: block;
            padding: 12px;
            color: #fff;
            text-align: center;
            text-decoration: none;
            transition: background 0.2s;
        }}
        .tabs a.active, .tabs a:hover {{ background: #1a252f; }}
        .tab-content {{ display: none; width: {width}; height: {height}; }}
        .tab-content.active {{ display: block; }}
        iframe {{ border: none; width: 100%; height: 100%; }}
    </style>
</head>
<body>
    <ul class="tabs">
        {tabs_html}
    </ul>
    {content_html}
    <script>
        const tabs = document.querySelectorAll('.tabs a');
        const contents = document.querySelectorAll('.tab-content');
        function activateTab(targetId) {{
            contents.forEach(content => content.classList.remove('active'));
            tabs.forEach(tab => tab.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            document.querySelector(`.tabs a[href='#${{targetId}}']`).classList.add('active');
        }}
        tabs.forEach(tab => {{
            tab.addEventListener('click', event => {{
                event.preventDefault();
                const targetId = tab.getAttribute('href').substring(1);
                activateTab(targetId);
            }});
        }});
        if (tabs.length > 0) {{
            const firstId = tabs[0].getAttribute('href').substring(1);
            activateTab(firstId);
        }}
    </script>
</body>
</html>
"""
    return template


def parse_args(argv: Optional[Sequence[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv-dir", type=Path, required=True, help="Diretório com os CSVs exportados dos índices.")
    parser.add_argument("--truecolor-red", type=Path, required=True, help="GeoTIFF da banda vermelha (red).")
    parser.add_argument("--truecolor-green", type=Path, required=True, help="GeoTIFF da banda verde (green).")
    parser.add_argument("--truecolor-blue", type=Path, required=True, help="GeoTIFF da banda azul (blue).")
    parser.add_argument("--output", type=Path, default=Path("mapas/dashboard_indices.html"), help="Arquivo HTML de saída.")
    parser.add_argument("--colormap", default="RdYlGn", help="Colormap padrão para os índices (default: RdYlGn).")
    parser.add_argument("--opacity", type=float, default=0.75, help="Opacidade dos índices (0-1).")
    parser.add_argument("--vmin", type=float, help="Valor mínimo global.")
    parser.add_argument("--vmax", type=float, help="Valor máximo global.")
    parser.add_argument("--geojson", type=Path, nargs="*", help="GeoJSON(s) para overlay/clip.")
    parser.add_argument("--padding", type=float, default=0.3, help="Padding aplicado ao envelope do GeoJSON.")
    parser.add_argument("--clip", action="store_true", help="Recorta ao polígono do GeoJSON.")
    parser.add_argument("--tiles", default="CartoDB positron", help="Camada base (use 'none' para offline).")
    parser.add_argument("--tile-attr", default=None, help="Atribuição personalizada do tileset.")
    parser.add_argument("--sharpen", action="store_true", help="Aplica unsharp mask aos índices.")
    parser.add_argument("--sharpen-radius", type=float, default=1.0, help="Raio da unsharp mask.")
    parser.add_argument("--sharpen-amount", type=float, default=1.3, help="Intensidade da unsharp mask.")
    parser.add_argument("--upsample", type=float, default=1.0, help="Fator de upsample dos índices.")
    parser.add_argument("--smooth-radius", type=float, default=0.0, help="Raio de suavização após o upsample.")
    return parser.parse_args(argv)


def main(argv: Optional[Sequence[str]] = None) -> None:
    args = parse_args(argv)
    csv_dir = args.csv_dir.expanduser().resolve()
    overlay_paths = [path.expanduser().resolve() for path in (args.geojson or [])]
    overlay_geojsons, clip_bounds = _collect_overlays(overlay_paths, args.padding, args.clip)

    csv_files = sorted(csv_dir.glob("*.csv"))
    if not csv_files:
        raise SystemExit(f"Nenhum CSV encontrado em {csv_dir}")

    layer_html_map: Dict[str, str] = {}

    truecolor_prepared, _ = _prepare_truecolor(
        args.truecolor_red.expanduser().resolve(),
        args.truecolor_green.expanduser().resolve(),
        args.truecolor_blue.expanduser().resolve(),
        overlay_geojsons,
        clip_bounds,
        clip=args.clip,
        sharpen=args.sharpen,
        sharpen_radius=args.sharpen_radius,
        sharpen_amount=args.sharpen_amount,
    )
    truecolor_map = _build_layer_map(
        truecolor_prepared,
        cmap=args.colormap,
        vmin=args.vmin,
        vmax=args.vmax,
        opacity=1.0,
        tiles=args.tiles,
        tile_attr=args.tile_attr,
    )
    layer_html_map["truecolor"] = _create_iframe_from_map(truecolor_map)

    for csv_path in csv_files:
        prepared = _prepare_from_csv(
            csv_path,
            overlay_geojsons,
            clip_bounds,
            clip=args.clip,
            upsample=args.upsample,
            sharpen=args.sharpen,
            sharpen_radius=args.sharpen_radius,
            sharpen_amount=args.sharpen_amount,
            smooth_radius=args.smooth_radius,
        )
        layer_map = _build_layer_map(
            prepared,
            cmap=args.colormap,
            vmin=args.vmin,
            vmax=args.vmax,
            opacity=args.opacity,
            tiles=args.tiles,
            tile_attr=args.tile_attr,
        )
        layer_html_map[prepared.index_name] = _create_iframe_from_map(layer_map)

    dashboard_html = _create_dashboard_html(layer_html_map)
    output_path = args.output.expanduser().resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(dashboard_html, encoding="utf-8")
    print(f"Dashboard salvo em {output_path}")


if __name__ == "__main__":
    main()
