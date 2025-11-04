# Sentinel-2 Sugarcane Health Toolkit

O projeto foi dividido em três camadas principais:

1. **Core (`canasat/`)** – processamento de imagens Sentinel-2 (download, extração de bandas, cálculo de índices, renderizadores). Documentação completa em `docs/core/core.md`.
2. **API** – serviço FastAPI que orquestra o core e expõe os artefatos; futura migração para Node.js. Ver `docs/api/api.md`.
3. **Frontend Web** – aplicação Vite/React que consome os mapas/CSV. Ver `docs/web/web.md`.

### Como navegar

- Consulte `docs/core/CONTEXTO.md` para entender o contexto agronômico e técnico do core.
- O progresso da migração OO está em `docs/core/todo_oop.md` e `docs/core/RELATORIO_MIGRACAO_CORE.md`.
- Todos os scripts CLIs (`scripts/`) continuam disponíveis como wrappers finos das classes do core.

### Requisitos gerais

- Python 3.10+ (core/API)
- Node.js LTS (frontend)
- Acesso ao Copernicus Data Space para baixar cenas Sentinel‑2.

> Detalhes de instalação, execução e parâmetros específicos estão descritos em cada documentação (`core.md`, `api.md`, `web.md`).
