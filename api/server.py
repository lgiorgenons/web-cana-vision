from __future__ import annotations

import os
from pathlib import Path
import sys
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

SCRIPTS_DIR = Path(__file__).resolve().parents[1] / "scripts"
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

from render_multi_index_map import build_multi_map  # type: ignore  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parents[1]
PROCESSED_DIR = REPO_ROOT / "data" / "processed"
MAPAS_DIR = REPO_ROOT / "mapas"
TABELAS_DIR = REPO_ROOT / "tabelas"
DADOS_DIR = REPO_ROOT / "dados"

MAPAS_DIR.mkdir(parents=True, exist_ok=True)
TABELAS_DIR.mkdir(parents=True, exist_ok=True)


def _list_products() -> List[str]:
    if not PROCESSED_DIR.exists():
        return []
    return sorted([p.name for p in PROCESSED_DIR.iterdir() if p.is_dir()])


def _latest_product() -> Optional[str]:
    items = [p for p in PROCESSED_DIR.iterdir() if p.is_dir()] if PROCESSED_DIR.exists() else []
    if not items:
        return None
    items.sort(key=lambda p: p.stat().st_mtime, reverse=True)
    return items[0].name


def _indices_for_product(product: str) -> Dict[str, str]:
    indices_dir = PROCESSED_DIR / product / "indices"
    if not indices_dir.exists():
        return {}
    return {p.stem: str(p.resolve()) for p in indices_dir.glob("*.tif")}


def _ensure_compare_map(product: str) -> str:
    compare_path = MAPAS_DIR / "compare_indices_all.html"
    indices_dir = PROCESSED_DIR / product / "indices"
    if not indices_dir.exists():
        raise HTTPException(status_code=404, detail=f"Diretório de índices não encontrado para {product}")

    index_paths = sorted(indices_dir.glob("*.tif"))
    if not index_paths:
        raise HTTPException(status_code=404, detail=f"Nenhum GeoTIFF de índice encontrado para {product}")

    needs_build = True
    if compare_path.exists():
        map_mtime = compare_path.stat().st_mtime
        needs_build = any(p.stat().st_mtime > map_mtime for p in index_paths)

    if needs_build:
        overlays: List[Path] = []
        default_geojson = DADOS_DIR / "map.geojson"
        if default_geojson.exists():
            overlays.append(default_geojson)
        try:
            build_multi_map(
                index_paths=index_paths,
                output_path=compare_path,
                overlays=overlays,
                clip=True,
                upsample=12,
                smooth_radius=1.0,
                sharpen=True,
                sharpen_radius=1.2,
                sharpen_amount=1.5,
            )
        except Exception as exc:  # pragma: no cover - defensive
            raise HTTPException(status_code=500, detail=f"Falha ao gerar mapa de comparação: {exc}") from exc

    return "/mapas/compare_indices_all.html"


app = FastAPI(title="Cana Virus API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Static mounts to serve generated artifacts to the web app via Vite proxy
if MAPAS_DIR.exists():
    app.mount("/mapas", StaticFiles(directory=str(MAPAS_DIR)), name="mapas")
if TABELAS_DIR.exists():
    app.mount("/tabelas", StaticFiles(directory=str(TABELAS_DIR)), name="tabelas")


@app.get("/api/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/api/products")
def products() -> Dict[str, List[str]]:
    return {"products": _list_products()}


@app.get("/api/indices")
def indices(product: Optional[str] = Query(default=None)) -> Dict[str, Dict[str, str]]:
    prod = product or _latest_product()
    if not prod:
        return {"product": "", "indices": {}}
    return {"product": prod, "indices": _indices_for_product(prod)}


@app.get("/api/csv/{index_name}")
def get_csv(index_name: str):
    path = (TABELAS_DIR / f"{index_name}.csv").resolve()
    if not path.exists():
        raise HTTPException(status_code=404, detail="CSV not found")
    return FileResponse(str(path), media_type="text/csv", filename=path.name)


@app.get("/api/map/compare")
def compare_map(product: Optional[str] = Query(default=None)) -> Dict[str, str]:
    prod = product or _latest_product()
    if not prod:
        raise HTTPException(status_code=404, detail="Nenhum produto processado encontrado")

    url = _ensure_compare_map(prod)
    return {"url": url}


# Optional: serve truecolor overlay (very large files). Frontend can choose to embed it.
@app.get("/api/map/overlay")
def overlay_map() -> Dict[str, str]:
    target = MAPAS_DIR / "overlay_indices.html"
    if target.exists():
        return {"url": "/mapas/overlay_indices.html"}
    raise HTTPException(status_code=404, detail="Overlay map not found")
