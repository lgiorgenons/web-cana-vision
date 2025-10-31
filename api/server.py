from __future__ import annotations

import shlex
import subprocess
import sys
import threading
import uuid
from collections import deque
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from pathlib import Path
import os
from typing import Any, Deque, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

SCRIPTS_DIR = Path(__file__).resolve().parents[1] / "scripts"
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

from render_multi_index_map import build_multi_map  # type: ignore  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parents[1]
PROCESSED_DIR = REPO_ROOT / "data" / "processed"
MAPAS_DIR = REPO_ROOT / "mapas"
TABELAS_DIR = REPO_ROOT / "tabelas"
DADOS_DIR = REPO_ROOT / "dados"
WORKFLOW_SCRIPT = SCRIPTS_DIR / "run_full_workflow.py"

MAPAS_DIR.mkdir(parents=True, exist_ok=True)
TABELAS_DIR.mkdir(parents=True, exist_ok=True)

MAX_LOG_LINES = 500
JOB_EXECUTOR = ThreadPoolExecutor(max_workers=1)
_jobs_lock = threading.Lock()


class JobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    SUCCEEDED = "succeeded"
    FAILED = "failed"


@dataclass
class JobInfo:
    job_id: str
    status: JobStatus
    created_at: datetime
    updated_at: datetime
    params: Dict[str, Any]
    logs: Deque[str] = field(default_factory=lambda: deque(maxlen=MAX_LOG_LINES))
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    return_code: Optional[int] = None
    error: Optional[str] = None


_jobs: Dict[str, JobInfo] = {}


class RunWorkflowPayload(BaseModel):
    date: Optional[str] = None
    date_range: Optional[List[str]] = Field(default=None, min_items=2, max_items=2)
    geojson: Optional[str] = "dados/map.geojson"
    cloud: Optional[List[int]] = Field(default=None, min_items=2, max_items=2)
    download_dir: Optional[str] = None
    workdir: Optional[str] = None
    maps_dir: Optional[str] = None
    tables_dir: Optional[str] = None
    indices: Optional[List[str]] = None
    primary_indices: Optional[List[str]] = None
    overlay_indices: Optional[List[str]] = None
    generate_overlay: bool = False
    safe_path: Optional[str] = None
    tiles: Optional[str] = None
    tile_attr: Optional[str] = None
    upsample: Optional[float] = None
    smooth_radius: Optional[float] = None
    sharpen_radius: Optional[float] = None
    sharpen_amount: Optional[float] = None
    no_sharpen: Optional[bool] = None
    padding: Optional[float] = None
    opacity: Optional[float] = None
    vmin: Optional[float] = None
    vmax: Optional[float] = None
    log_level: str = "INFO"


def _list_products() -> List[str]:
    if not PROCESSED_DIR.exists():
        return []
    return sorted([p.name for p in PROCESSED_DIR.iterdir() if p.is_dir()])


def _latest_product() -> Optional[str]:
    if not PROCESSED_DIR.exists():
        return None
    items = [p for p in PROCESSED_DIR.iterdir() if p.is_dir()]
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
        raise HTTPException(status_code=404, detail=f"Diretório de índices não encontrado para {product}.")

    index_paths = sorted(indices_dir.glob("*.tif"))
    if not index_paths:
        raise HTTPException(status_code=404, detail=f"Nenhum GeoTIFF de índice encontrado para {product}.")

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


def _resolve_path(path: Optional[str]) -> Optional[str]:
    if path is None:
        return None
    resolved = Path(path)
    if not resolved.is_absolute():
        resolved = REPO_ROOT / resolved
    return str(resolved)


def _build_workflow_command(payload: RunWorkflowPayload) -> List[str]:
    if not WORKFLOW_SCRIPT.exists():
        raise RuntimeError("Script run_full_workflow.py não encontrado.")

    cmd: List[str] = [sys.executable, str(WORKFLOW_SCRIPT)]

    if payload.date_range:
        start, end = payload.date_range
        cmd.extend(["--date-range", start, end])
    elif payload.date:
        cmd.extend(["--date", payload.date])
    else:
        raise ValueError("É necessário informar 'date' ou 'date_range'.")

    if payload.geojson:
        cmd.extend(["--geojson", str(Path(payload.geojson))])
    if payload.cloud:
        cmd.extend(["--cloud", *(str(int(value)) for value in payload.cloud)])
    if payload.download_dir:
        cmd.extend(["--download-dir", _resolve_path(payload.download_dir) or payload.download_dir])
    if payload.workdir:
        cmd.extend(["--workdir", _resolve_path(payload.workdir) or payload.workdir])
    if payload.maps_dir:
        cmd.extend(["--maps-dir", _resolve_path(payload.maps_dir) or payload.maps_dir])
    if payload.tables_dir:
        cmd.extend(["--tables-dir", _resolve_path(payload.tables_dir) or payload.tables_dir])
    if payload.indices:
        cmd.extend(["--indices", *payload.indices])
    if payload.primary_indices:
        cmd.extend(["--primary-indices", *payload.primary_indices])
    if payload.overlay_indices:
        cmd.extend(["--overlay-indices", *payload.overlay_indices])
    if payload.generate_overlay:
        cmd.append("--generate-overlay")
    if payload.safe_path:
        cmd.extend(["--safe-path", _resolve_path(payload.safe_path) or payload.safe_path])
    if payload.tiles:
        cmd.extend(["--tiles", payload.tiles])
    if payload.tile_attr:
        cmd.extend(["--tile-attr", payload.tile_attr])
    if payload.upsample is not None:
        cmd.extend(["--upsample", str(payload.upsample)])
    if payload.smooth_radius is not None:
        cmd.extend(["--smooth-radius", str(payload.smooth_radius)])
    if payload.sharpen_radius is not None:
        cmd.extend(["--sharpen-radius", str(payload.sharpen_radius)])
    if payload.sharpen_amount is not None:
        cmd.extend(["--sharpen-amount", str(payload.sharpen_amount)])
    if payload.no_sharpen:
        cmd.append("--no-sharpen")
    if payload.padding is not None:
        cmd.extend(["--padding", str(payload.padding)])
    if payload.opacity is not None:
        cmd.extend(["--opacity", str(payload.opacity)])
    if payload.vmin is not None:
        cmd.extend(["--vmin", str(payload.vmin)])
    if payload.vmax is not None:
        cmd.extend(["--vmax", str(payload.vmax)])
    if payload.log_level:
        cmd.extend(["--log-level", payload.log_level])

    return cmd


def _ensure_credentials(payload: RunWorkflowPayload) -> None:
    if payload.safe_path:
        return
    username = os.environ.get("SENTINEL_USERNAME")
    password = os.environ.get("SENTINEL_PASSWORD")
    if not username or not password:
        raise HTTPException(
            status_code=400,
            detail=(
                "Credenciais do Copernicus ausentes. Configure SENTINEL_USERNAME e SENTINEL_PASSWORD ou forneça "
                "um arquivo SAFE existente via 'safe_path'."
            ),
        )


def _append_log(job_id: str, message: str) -> None:
    with _jobs_lock:
        job = _jobs.get(job_id)
        if not job:
            return
        job.logs.append(message)
        job.updated_at = datetime.utcnow()


def _update_job(job_id: str, **changes: Any) -> None:
    with _jobs_lock:
        job = _jobs.get(job_id)
        if not job:
            return
        for key, value in changes.items():
            setattr(job, key, value)
        job.updated_at = datetime.utcnow()


def _serialise_job(job: JobInfo) -> Dict[str, Any]:
    return {
        "job_id": job.job_id,
        "status": job.status.value,
        "created_at": job.created_at.isoformat(),
        "updated_at": job.updated_at.isoformat(),
        "started_at": job.started_at.isoformat() if job.started_at else None,
        "finished_at": job.finished_at.isoformat() if job.finished_at else None,
        "params": job.params,
        "logs": list(job.logs),
        "return_code": job.return_code,
        "error": job.error,
    }


def _run_workflow_job(job_id: str, payload_dict: Dict[str, Any]) -> None:
    payload = RunWorkflowPayload(**payload_dict)
    _update_job(job_id, status=JobStatus.RUNNING, started_at=datetime.utcnow(), error=None, return_code=None)

    try:
        command = _build_workflow_command(payload)
    except Exception as exc:  # pragma: no cover - defensive
        _append_log(job_id, f"Erro ao preparar comando: {exc}")
        _update_job(job_id, status=JobStatus.FAILED, finished_at=datetime.utcnow(), error=str(exc))
        return

    quoted = " ".join(shlex.quote(part) for part in command)
    _append_log(job_id, f"$ {quoted}")

    process = subprocess.Popen(
        command,
        cwd=str(REPO_ROOT),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )

    assert process.stdout is not None
    try:
        for line in process.stdout:
            _append_log(job_id, line.rstrip())
        return_code = process.wait()
    finally:
        process.stdout.close()

    if return_code == 0:
        _update_job(job_id, status=JobStatus.SUCCEEDED, finished_at=datetime.utcnow(), return_code=return_code)
    else:
        message = f"Workflow finalizado com código {return_code}."
        _append_log(job_id, message)
        _update_job(
            job_id,
            status=JobStatus.FAILED,
            finished_at=datetime.utcnow(),
            return_code=return_code,
            error=message,
        )


app = FastAPI(title="Cana Virus API", version="1.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
def indices(product: Optional[str] = None) -> Dict[str, Any]:
    prod = product or _latest_product()
    if not prod:
        return {"product": "", "indices": {}}
    return {"product": prod, "indices": _indices_for_product(prod)}


@app.get("/api/csv/{index_name}")
def get_csv(index_name: str):
    path = (TABELAS_DIR / f"{index_name}.csv").resolve()
    if not path.exists():
        raise HTTPException(status_code=404, detail="CSV não encontrado.")
    return FileResponse(str(path), media_type="text/csv", filename=path.name)


@app.get("/api/map/compare")
def compare_map(product: Optional[str] = None) -> Dict[str, str]:
    prod = product or _latest_product()
    if not prod:
        raise HTTPException(status_code=404, detail="Nenhum produto processado encontrado.")

    url = _ensure_compare_map(prod)
    return {"url": url}


@app.get("/api/map/overlay")
def overlay_map() -> Dict[str, str]:
    target = MAPAS_DIR / "overlay_indices.html"
    if target.exists():
        return {"url": "/mapas/overlay_indices.html"}
    raise HTTPException(status_code=404, detail="Overlay não encontrado.")


@app.post("/api/jobs/run-workflow")
def run_workflow_job(payload: RunWorkflowPayload) -> Dict[str, str]:
    payload_dict = payload.dict()
    if not payload_dict.get("date") and not payload_dict.get("date_range"):
        raise HTTPException(status_code=400, detail="Informe 'date' ou 'date_range'.")

    _ensure_credentials(payload)

    job_id = uuid.uuid4().hex
    job = JobInfo(
        job_id=job_id,
        status=JobStatus.PENDING,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        params=payload_dict,
    )

    with _jobs_lock:
        _jobs[job_id] = job

    JOB_EXECUTOR.submit(_run_workflow_job, job_id, payload_dict)

    return {"job_id": job_id, "status": job.status.value}


@app.get("/api/jobs")
def list_jobs() -> Dict[str, List[Dict[str, Any]]]:
    with _jobs_lock:
        return {"jobs": [_serialise_job(job) for job in _jobs.values()]}


@app.get("/api/jobs/{job_id}")
def job_status(job_id: str) -> Dict[str, Any]:
    with _jobs_lock:
        job = _jobs.get(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job não encontrado.")
        return _serialise_job(job)
