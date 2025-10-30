"""Renderiza um mapa com a imagem true color sempre visível e sobreposições de índices em CSV.

O script usa os CSVs exportados (longitude, latitude, value) para criar camadas
alternáveis sobre a composição verdadeira (R/G/B) do Sentinel-2. Ideal para
visualizações onde o usuário precisa comparar rapidamente os índices sobre a
imagem real.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import Iterable, List, Optional, Sequence, Tuple

import folium
import numpy as np
from rasterio.transform import array_bounds

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from render_csv_map import _load_csv_grid, _build_grid, _expand_to_clip_bounds  # type: ignore  # noqa: E402
from render_index_map import (  # type: ignore  # noqa: E402
    _apply_overlay_mask,
    _apply_smoothing,
    _collect_overlays,
    _generate_rgba,
    _upsample_raster,
)
from render_truecolor_map import _apply_unsharp_mask, _create_rgb_image, _reproject_to_wgs84  # type: ignore  # noqa: E402


def _prepare_truecolor(
    red_path: Path,
    green_path: Path,
    blue_path: Path,
    *,
    sharpen: bool,
    sharpen_radius: float,
    sharpen_amount: float,
) -> Tuple[np.ndarray, Tuple[float, float, float, float]]:
    red_array, transform, bounds = _reproject_to_wgs84(red_path, clip_bounds_wgs84=None)
    height, width = red_array.shape
    green_array, _, _ = _reproject_to_wgs84(
        green_path,
        clip_bounds_wgs84=None,
        dst_transform=transform,
        dst_width=width,
        dst_height=height,
    )
    blue_array, _, _ = _reproject_to_wgs84(
        blue_path,
        clip_bounds_wgs84=None,
        dst_transform=transform,
        dst_width=width,
        dst_height=height,
    )

    if sharpen:
        red_array = _apply_unsharp_mask(red_array, radius=sharpen_radius, amount=sharpen_amount)
        green_array = _apply_unsharp_mask(green_array, radius=sharpen_radius, amount=sharpen_amount)
        blue_array = _apply_unsharp_mask(blue_array, radius=sharpen_radius, amount=sharpen_amount)

    image = _create_rgb_image(red_array, green_array, blue_array)
    return image, bounds


def _prepare_overlay(
    csv_path: Path,
    overlay_geojsons: Iterable[dict],
    clip_bounds: Optional[Tuple[float, float, float, float]],
    *,
    clip: bool,
    upsample: float,
    sharpen: bool,
    sharpen_radius: float,
    sharpen_amount: float,
    smooth_radius: float,
) -> Tuple[np.ndarray, Tuple[float, float, float, float]]:
    lons, lats, values = _load_csv_grid(csv_path)
    grid, transform = _build_grid(lons, lats, values)
    data = grid

    if sharpen:
        data = _apply_unsharp_mask(data, radius=sharpen_radius, amount=sharpen_amount)

    if clip and overlay_geojsons:
        data = _apply_overlay_mask(data, transform, overlay_geojsons)

    if clip and clip_bounds is not None:
        data, transform = _expand_to_clip_bounds(data, transform, clip_bounds)

    data, transform = _upsample_raster(data, transform, upsample, nodata=np.nan)
    data = _apply_smoothing(data, smooth_radius)

    if clip and overlay_geojsons and upsample > 1.0:
        data = _apply_overlay_mask(data, transform, overlay_geojsons)

    bounds = array_bounds(data.shape[0], data.shape[1], transform)
    final_bounds = clip_bounds if clip_bounds is not None else bounds
    return data, final_bounds


def build_overlay_map(
    csv_dir: Path,
    red_path: Path,
    green_path: Path,
    blue_path: Path,
    overlays: Iterable[Path],
    *,
    clip: bool,
    padding: float,
    tiles: str,
    tile_attr: Optional[str],
    colormap: str,
    opacity: float,
    vmin: Optional[float],
    vmax: Optional[float],
    upsample: float,
    sharpen: bool,
    sharpen_radius: float,
    sharpen_amount: float,
    smooth_radius: float,
    indices: Optional[Sequence[str]] = None,
) -> folium.Map:
    overlay_geojsons, clip_bounds = _collect_overlays(overlays, padding, clip)

    truecolor_image, truecolor_bounds = _prepare_truecolor(
        red_path,
        green_path,
        blue_path,
        sharpen=sharpen,
        sharpen_radius=sharpen_radius,
        sharpen_amount=sharpen_amount,
    )

    min_lon, min_lat, max_lon, max_lat = truecolor_bounds
    centre_lat = (min_lat + max_lat) / 2
    centre_lon = (min_lon + max_lon) / 2

    if tiles.lower() == "none":
        base_map = folium.Map(location=[centre_lat, centre_lon], zoom_start=12, tiles=None)
    else:
        base_map = folium.Map(location=[centre_lat, centre_lon], zoom_start=12, tiles=tiles, attr=tile_attr)

    folium.raster_layers.ImageOverlay(
        image=truecolor_image,
        bounds=[[min_lat, min_lon], [max_lat, max_lon]],
        opacity=1.0,
        name="True color",
        control=False,
    ).add_to(base_map)

    for geojson_data in overlay_geojsons:
        folium.GeoJson(data=geojson_data, name="Area de interesse", style_function=lambda _: {"fillOpacity": 0}).add_to(base_map)

    csv_files = sorted(csv_dir.glob("*.csv"))
    if indices:
        requested = set(indices)
        csv_files = [path for path in csv_files if path.stem in requested]
    if not csv_files:
        raise RuntimeError(f"Nenhum CSV encontrado em {csv_dir} (verifique filtros, se houver).")

    for idx, csv_path in enumerate(csv_files):
        data, bounds = _prepare_overlay(
            csv_path,
            overlay_geojsons,
            clip_bounds,
            clip=clip,
            upsample=upsample,
            sharpen=sharpen,
            sharpen_radius=sharpen_radius,
            sharpen_amount=sharpen_amount,
            smooth_radius=smooth_radius,
        )
        image, _, _ = _generate_rgba(data, colormap, vmin, vmax, opacity)

        feature = folium.FeatureGroup(name=csv_path.stem, show=(idx == 0))
        folium.raster_layers.ImageOverlay(
            image=image,
            bounds=[[bounds[1], bounds[0]], [bounds[3], bounds[2]]],
            opacity=1.0,
            name=csv_path.stem,
        ).add_to(feature)
        feature.add_to(base_map)

    folium.LayerControl(collapsed=False).add_to(base_map)
    focus_bounds = clip_bounds if clip_bounds is not None else truecolor_bounds
    base_map.fit_bounds([[focus_bounds[1], focus_bounds[0]], [focus_bounds[3], focus_bounds[2]]])
    return base_map


def parse_args(argv: Optional[Sequence[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv-dir", type=Path, required=True, help="Diretório com os CSVs exportados dos índices.")
    parser.add_argument("--truecolor-red", type=Path, required=True, help="GeoTIFF da banda vermelha (red).")
    parser.add_argument("--truecolor-green", type=Path, required=True, help="GeoTIFF da banda verde (green).")
    parser.add_argument("--truecolor-blue", type=Path, required=True, help="GeoTIFF da banda azul (blue).")
    parser.add_argument("--output", type=Path, default=Path("mapas/overlay_indices.html"), help="Arquivo HTML de saída.")
    parser.add_argument(
        "--indices",
        nargs="+",
        help="Lista opcional dos índices (nome do arquivo CSV sem extensão) a incluir, ex.: ndvi ndmi.",
    )
    parser.add_argument("--geojson", type=Path, nargs="*", help="GeoJSON(s) para overlay e clip.")
    parser.add_argument("--clip", action="store_true", help="Recorta ao(s) polígono(s) informado(s).")
    parser.add_argument("--padding", type=float, default=0.3, help="Padding aplicado ao envelope dos GeoJSONs.")
    parser.add_argument("--tiles", default="CartoDB positron", help="Camada base folium (use 'none' para apenas true color).")
    parser.add_argument("--tile-attr", default=None, help="Atribuição personalizada do tileset.")
    parser.add_argument("--colormap", default="RdYlGn", help="Colormap para os índices (default: RdYlGn).")
    parser.add_argument("--opacity", type=float, default=0.75, help="Opacidade dos índices (0-1).")
    parser.add_argument("--vmin", type=float, help="Valor mínimo fixo para todos os índices.")
    parser.add_argument("--vmax", type=float, help="Valor máximo fixo para todos os índices.")
    parser.add_argument("--upsample", type=float, default=1.0, help="Fator de upsample aplicado aos índices.")
    parser.add_argument("--sharpen", action="store_true", help="Aplica unsharp mask tanto na true color quanto nos índices.")
    parser.add_argument("--sharpen-radius", type=float, default=1.0, help="Raio da unsharp mask.")
    parser.add_argument("--sharpen-amount", type=float, default=1.3, help="Intensidade da unsharp mask.")
    parser.add_argument("--smooth-radius", type=float, default=0.0, help="Suavização gaussiana após o upsample.")
    return parser.parse_args(argv)


def main(argv: Optional[Sequence[str]] = None) -> None:
    args = parse_args(argv)
    csv_dir = args.csv_dir.expanduser().resolve()
    if not csv_dir.is_dir():
        raise SystemExit(f"Diretório de CSVs não encontrado: {csv_dir}")

    overlays = [path.expanduser().resolve() for path in (args.geojson or [])]
    map_obj = build_overlay_map(
        csv_dir=csv_dir,
        red_path=args.truecolor_red.expanduser().resolve(),
        green_path=args.truecolor_green.expanduser().resolve(),
        blue_path=args.truecolor_blue.expanduser().resolve(),
        overlays=overlays,
        clip=args.clip,
        padding=args.padding,
        tiles=args.tiles,
        tile_attr=args.tile_attr,
        colormap=args.colormap,
        opacity=args.opacity,
        vmin=args.vmin,
        vmax=args.vmax,
        upsample=args.upsample,
        sharpen=args.sharpen,
        sharpen_radius=args.sharpen_radius,
        sharpen_amount=args.sharpen_amount,
        smooth_radius=args.smooth_radius,
        indices=args.indices,
    )

    output_path = args.output.expanduser().resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    map_obj.save(str(output_path))
    print(f"Mapa com sobreposições salvo em {output_path}")


if __name__ == "__main__":
    main()
