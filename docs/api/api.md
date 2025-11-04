# API (FastAPI)

Esta camada expõe endpoints REST para acionar o core (`canasat/`) e entregar os artefatos gerados (HTML, CSV, metadados). Durante a transição, ela continuará disponível, mas a estratégia futura é substituí-la por um backend em Node.js.

## Requisitos

- Python 3.10+
- Dependências em `requirements.txt`

## Ambiente de desenvolvimento

```bash
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

uvicorn api.server:app --reload --port 8000
```

### Variáveis de ambiente

- `SENTINEL_USERNAME` / `SENTINEL_PASSWORD` – credenciais do Copernicus Data Space.
- As pastas padrão (`data/raw`, `data/processed`, `mapas`, `tabelas`) podem ser ajustadas assim que `AppConfig` for migrado para Pydantic Settings.

## Endpoints atuais (FastAPI)

- `POST /api/workflow` – agenda download/processamento usando `WorkflowService`.
- `GET /api/workflow/jobs` / `GET /api/workflow/<job_id>` – consulta status/logs.
- `GET /mapas/*`, `GET /tabelas/*` – serve arquivos estáticos gerados.

## Próximas etapas

1. Padronizar `AppConfig` (Pydantic) para leitura de variáveis e credenciais.
2. Mapear o que será migrado para o backend em Node.js (jobs, histórico, autenticação).
3. Garantir que os logs expostos pelo serviço não incluam segredos e estejam prontos para monitoramento.
