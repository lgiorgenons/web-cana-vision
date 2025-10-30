"""Renderiza um mapa interativo a partir de um CSV com colunas longitude, latitude e valor.

O CSV deve ser gerado pela função ``export_csv`` (ou script ``export_indices_csv.py``),
mantendo a grade regular em WGS84. O script reconstrói a matriz, aplica as mesmas
transformações usadas na renderização original (clip, upsample, suavização, nitidez)
e gera um HTML compatível com o fluxo da ferramenta.
"""
from __future__ import annotations

import argparse
import csv
from pathlib import Path
from typing import Iterable, Optional, Sequence, Tuple, Dict, Any

import numpy as np
from affine import Affine
from rasterio.transform import array_bounds

from render_index_map import (  # type: ignore
    PreparedRaster,
    _apply_overlay_mask,
    _apply_smoothing,
    _apply_unsharp_mask,
    _collect_overlays,
    _upsample_raster,
    build_map,
)


def _load_csv_grid(path: Path) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    with path.open("r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        lons: list[float] = []
        lats: list[float] = []
        values: list[float] = []
        for row in reader:
            try:
                lon = float(row["longitude"])
                lat = float(row["latitude"])
                val = float(row["value"])
            except KeyError as exc:
                raise ValueError(f"CSV {path} precisa das colunas longitude, latitude, value.") from exc
            except ValueError as exc:
                raise ValueError(f"CSV {path} contém valores inválidos: {row}") from exc
            lons.append(lon)
            lats.append(lat)
            values.append(val)
    if not lons:
        raise ValueError(f"CSV {path} está vazio ou sem dados válidos.")
    return np.array(lons, dtype=np.float64), np.array(lats, dtype=np.float64), np.array(values, dtype=np.float32)


def _build_grid(lons: np.ndarray, lats: np.ndarray, values: np.ndarray) -> Tuple[np.ndarray, Affine]:
    unique_lons = np.unique(lons)
    unique_lats = np.unique(lats)[::-1]  # maior latitude primeiro
    if unique_lons.size * unique_lats.size != lons.size:
        raise ValueError("Os dados não formam uma grade regular. Garanta que o CSV veio do exportador oficial.")

    lon_index = {lon: idx for idx, lon in enumerate(unique_lons)}
    lat_index = {lat: idx for idx, lat in enumerate(unique_lats)}

    grid = np.full((unique_lats.size, unique_lons.size), np.nan, dtype=np.float32)
    for lon, lat, val in zip(lons, lats, values, strict=False):
        grid[lat_index[lat], lon_index[lon]] = val

    if unique_lons.size > 1:
        lon_res = float(unique_lons[1] - unique_lons[0])
    else:
        lon_res = 0.0001  # fallback para pixel único
    if unique_lats.size > 1:
        lat_res = float(unique_lats[0] - unique_lats[1])
    else:
        lat_res = 0.0001
    lon_origin = float(unique_lons[0] - lon_res / 2)
    lat_origin = float(unique_lats[0] + lat_res / 2)
    transform = Affine.translation(lon_origin, lat_origin) * Affine.scale(lon_res, -lat_res)
    return grid, transform


def _expand_to_clip_bounds(
    data: np.ndarray,
    transform: Affine,
    clip_bounds: Tuple[float, float, float, float],
) -> Tuple[np.ndarray, Affine]:
    lon_res = float(transform.a)
    lat_res = float(-transform.e)
    if lon_res <= 0 or lat_res <= 0:
        raise ValueError("Transformo inadequado encontrado ao reconstruir a grade do CSV.")

    current_bounds = array_bounds(data.shape[0], data.shape[1], transform)

    def _pad_count(delta: float, resolution: float) -> int:
        pixels = delta / resolution
        if pixels <= 0:
            return 0
        return int(round(pixels))

    left_pad = _pad_count(current_bounds[0] - clip_bounds[0], lon_res)
    right_pad = _pad_count(clip_bounds[2] - current_bounds[2], lon_res)
    top_pad = _pad_count(clip_bounds[3] - current_bounds[3], lat_res)
    bottom_pad = _pad_count(current_bounds[1] - clip_bounds[1], lat_res)

    if any(value != 0 for value in (left_pad, right_pad, top_pad, bottom_pad)):
        padded_height = top_pad + data.shape[0] + bottom_pad
        padded_width = left_pad + data.shape[1] + right_pad
        padded = np.full((padded_height, padded_width), np.nan, dtype=data.dtype)
        padded[top_pad : top_pad + data.shape[0], left_pad : left_pad + data.shape[1]] = data
        data = padded
        lon_origin = clip_bounds[0] - lon_res / 2.0
        lat_origin = clip_bounds[3] + lat_res / 2.0
        transform = Affine.translation(lon_origin, lat_origin) * Affine.scale(lon_res, -lat_res)

    return data, transform


def _prepare_from_csv(
    csv_path: Path,
    overlay_paths: Iterable[Path],
    *,
    padding_factor: float,
    clip: bool,
    upsample: float,
    sharpen: bool,
    sharpen_radius: float,
    sharpen_amount: float,
    smooth_radius: float,
) -> PreparedRaster:
    lons, lats, values = _load_csv_grid(csv_path)
    grid, transform = _build_grid(lons, lats, values)

    overlay_geojsons, clip_bounds = _collect_overlays(overlay_paths, padding_factor, clip)

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

    bounds = array_bounds(data.shape[0], data.shape[1], transform)

    return PreparedRaster(
        data=data,
        transform=transform,
        bounds=bounds,
        clip_bounds=clip_bounds,
        overlay_geojsons=list(overlay_geojsons),
        index_name=csv_path.stem,
    )


def parse_args(argv: Optional[Sequence[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv", type=Path, required=True, help="Arquivo CSV com colunas longitude, latitude e value.")
    parser.add_argument("--output", type=Path, default=Path("mapa_csv.html"), help="HTML de saída.")
    parser.add_argument("--colormap", default="RdYlGn", help="Colormap Matplotlib (default: RdYlGn).")
    parser.add_argument("--vmin", type=float, help="Valor mínimo para o stretch.")
    parser.add_argument("--vmax", type=float, help="Valor máximo para o stretch.")
    parser.add_argument("--opacity", type=float, default=0.75, help="Opacidade da camada (0-1).")
    parser.add_argument("--geojson", type=Path, nargs="*", help="GeoJSON(s) para overlay e recorte.")
    parser.add_argument("--tiles", default="CartoDB positron", help="Camada base (use 'none' para modo offline).")
    parser.add_argument("--tile-attr", default=None, help="Atribuição personalizada da camada base.")
    parser.add_argument("--padding", type=float, default=0.3, help="Padding aplicado ao envelope do GeoJSON.")
    parser.add_argument("--clip", action="store_true", help="Recorta a malha ao(s) polígono(s) do(s) GeoJSON(s).")
    parser.add_argument("--sharpen", action="store_true", help="Aplica unsharp mask antes da renderização.")
    parser.add_argument("--sharpen-radius", type=float, default=1.0, help="Raio (sigma) da unsharp mask.")
    parser.add_argument("--sharpen-amount", type=float, default=1.3, help="Intensidade da unsharp mask.")
    parser.add_argument("--upsample", type=float, default=1.0, help="Fator de upsample para suavizar pixels.")
    parser.add_argument("--smooth-radius", type=float, default=0.0, help="Raio da suavização gaussiana após upsample.")
    return parser.parse_args(argv)


def main(argv: Optional[Sequence[str]] = None) -> None:
    args = parse_args(argv)
    csv_path = args.csv.expanduser().resolve()
    overlay_paths = [path.expanduser().resolve() for path in (args.geojson or [])]

    prepared = _prepare_from_csv(
        csv_path,
        overlay_paths,
        padding_factor=args.padding,
        clip=args.clip,
        upsample=args.upsample,
        sharpen=args.sharpen,
        sharpen_radius=args.sharpen_radius,
        sharpen_amount=args.sharpen_amount,
        smooth_radius=args.smooth_radius,
    )

    output = build_map(
        prepared=prepared,
        output_path=args.output.expanduser().resolve(),
        cmap_name=args.colormap,
        vmin=args.vmin,
        vmax=args.vmax,
        opacity=args.opacity,
        tiles=args.tiles,
        tile_attr=args.tile_attr,
    )
    print(f"Mapa salvo em {output}")


if __name__ == "__main__":
    main()
