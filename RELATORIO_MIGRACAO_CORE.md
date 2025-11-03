## Progresso da migração para o core (sessão atual)

- Migrei os renderizadores principais para `canasat/rendering/`:
  - `IndexMapRenderer` agora lida com mapas single-index e exportação CSV, substituindo a lógica procedural antiga.
  - `CSVMapRenderer` reconstrói grades a partir dos CSVs exportados.
  - `TrueColorRenderer` gera a composição RGB em classe reutilizável.
  - `TrueColorOverlayRenderer` combina true color com camadas de índices (CSV) alternáveis.
- Criei utilidades compartilhadas (`csv_utils.py`, `geoutils.py`, `raster.py`) eliminando duplicação de código entre scripts.
- Atualizei os scripts CLI (`render_index_map.py`, `render_csv_map.py`, `render_truecolor_map.py`, `render_truecolor_overlay_map.py`, `export_indices_csv.py`) para atuarem como wrappers finos que instanciam as classes do core.
- Ajustei `scripts/run_full_workflow.py` e `api/server.py` para priorizarem os renderizadores orientados a objetos, mantendo fallback para versões legadas.
- Sincronizei documentação em `README.md`, `CONTEXTO.md` e `todo_oop.md` com o novo estado da arquitetura.

## Itens ainda pendentes após a sessão

1. Portar renderizadores auxiliares (galeria de bandas, comparações específicas) para o core seguindo o mesmo padrão OO.
2. Iniciar a camada de processamento (`SafeExtractor`, `IndexCalculator`) para remover dependências das funções monolíticas em `satellite_pipeline.py`.
3. Revisar o fluxo da API após a migração dos renderizadores auxiliares (novos endpoints e governança dos jobs).
4. Planejar testes automatizados (mocks de CSV/raster) para as novas classes antes de seguir com o restante da refatoração.
