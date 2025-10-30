# Sentinel-2 Sugarcane Health Toolkit

Utilitários em Python para baixar imagens Sentinel‑2 Level‑2A e gerar indicadores de estresse da vegetação para apoiar o monitoramento da Síndrome da Murcha da Cana (SMC). O fluxo segue as recomendações documentadas em `Analise_Detalhada_Sindrome_Murcha_Cana.md`.

## Requisitos
- Python 3.10 ou superior
- Conta ativa no [Copernicus Data Space](https://dataspace.copernicus.eu/)
- Não é necessário `unzip` (a extração ocorre via `zipfile`)

Instale as dependências em um ambiente virtual:

```bash
python -m venv .venv
source .venv/bin/activate   # PowerShell: .\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
```

## Autenticação
Por padrão o script lê as credenciais das variáveis de ambiente:

- `SENTINEL_USERNAME`
- `SENTINEL_PASSWORD`
- `SENTINEL_API_URL` (opcional, padrão `https://catalogue.dataspace.copernicus.eu/odata/v1/`)
- `SENTINEL_TOKEN_URL` (opcional, padrão `https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token`)
- `SENTINEL_CLIENT_ID` (opcional, padrão `cdse-public`)

Também é possível fornecê‑las pela linha de comando via `--username`, `--password`, `--api-url`, `--token-url` e `--client-id`. O script solicita um token OAuth2 automaticamente antes de consultar o catálogo OData e reutiliza a mesma sessão para o download.

### Habilitando o acesso OData
Antes da primeira execução, ative a API OData para o seu usuário no portal do Copernicus Data Space:

1. Acesse `https://dataspace.copernicus.eu/`, clique em **Login > Account Console** e entre com suas credenciais.
2. Em **Personal info**, aceite os termos de uso/privacidade e salve.
3. Abra **Applications** e habilite o aplicativo **OData API** (status: In use).
4. Opcional: gere um client secret apenas se for usar um cliente próprio; para este script o `client_id` padrão `cdse-public` já funciona.
5. Aguarde alguns minutos, faça logoff/logon e teste:
   ```bash
   curl -I -u "$SENTINEL_USERNAME:$SENTINEL_PASSWORD" \
     'https://catalogue.dataspace.copernicus.eu/odata/v1/Products?$top=1'
   ```
   A chamada deve retornar `HTTP/1.1 200 OK`. Se receber `401/403`, repita o passo 3 ou acione o suporte.

## Uso rápido
Baixe o produto mais recente para um polígono GeoJSON e gere todos os índices (NDVI, NDWI, MSI):

```bash
python scripts/satellite_pipeline.py \
  --geojson dados/aoi.geojson \
  --start-date 2024-04-01 \
  --end-date 2024-04-30 \
  --cloud 0 20 \
  --download-dir data/raw \
  --workdir data/processed \
  --log-level INFO
```

Parâmetros importantes:

- `--cloud` controla a faixa aceitável de cobertura de nuvens (percentual mínimo e máximo).
- `--indices` aceita uma lista (`ndvi`, `ndwi`, `msi`, etc.) caso deseje gerar apenas alguns produtos.
- `--safe-path` permite pular o download e reutilizar um arquivo `.SAFE` (zip) ou diretório já existente.

### Exemplo (reaproveitando download)
```bash
python scripts/satellite_pipeline.py \
  --safe-path data/raw/S2A_MSIL2A_*.SAFE.zip \
  --workdir data/processed \
  --indices ndvi ndwi msi evi ndre ndmi ndre1 ndre2 ndre3 ndre4 ci_rededge sipi
```

## Saídas
Os arquivos GeoTIFF dos índices são salvos em:

```
<workdir>/<produto>/indices/<indice>.tif
```

Os nomes dos índices:

- `ndvi`: vigor vegetativo.
- `ndwi`: status hídrico.
- `msi`: indicador de estresse por falta de umidade.
- `evi`: vigor em dosséis densos com correção atmosférica.
- `ndre`: sensível à clorofila (banda red‑edge).
- `ndmi`: umidade da vegetação usando NIR e SWIR.
- `ndre1`/`ndre2`/`ndre3`/`ndre4`: variantes NDRE usando cada banda red‑edge (B05…B8A) para detectar clorofila em diferentes profundidades do dossel.
- `ci_rededge`: índice de clorofila baseado na razão `nir/rededge4 - 1`.
- `sipi`: Structure Insensitive Pigment Index; avalia relações clorofila/carotenóides.

### Visualização rápida dos índices
Gere um mapa interativo (HTML) sobrepondo um índice ao mapa de fundo:

```bash
python scripts/render_index_map.py \
  --index data/processed/<produto>/indices/ndvi.tif \
  --geojson dados/map.geojson \
  --clip \
  --upsample 12 --smooth-radius 1 \
  --sharpen --sharpen-radius 1.2 --sharpen-amount 1.5 \
  --output mapas/ndvi.html
```

Substitua `ndvi.tif` por `evi.tif`, `ndre.tif` ou `ndmi.tif` para visualizar os demais índices derivados do Sentinel‑2.

A visualização usa, por padrão, o mapa `CartoDB positron` (necessita internet). Em ambiente offline execute com `--tiles none` para carregar apenas o raster.

A página resultante pode ser aberta diretamente no navegador. Ajuste `--colormap`, `--vmin`, `--vmax` e os parâmetros de nitidez (`--sharpen-radius`, `--sharpen-amount`) conforme necessário. Use `--clip` para recortar o raster ao(s) polígono(s) do(s) GeoJSON(s).

### Comparação em múltiplas camadas
Gere um único HTML com várias camadas de índices alternáveis (controle de camadas):

```bash
python scripts/render_multi_index_map.py \
  --index data/processed/<produto>/indices/ndvi.tif \
  --index data/processed/<produto>/indices/ndre.tif \
  --index data/processed/<produto>/indices/ndmi.tif \
  --index data/processed/<produto>/indices/ndwi.tif \
  --index data/processed/<produto>/indices/evi.tif \
  --geojson dados/map.geojson \
  --clip --upsample 12 --smooth-radius 1 --sharpen \
  --output mapas/compare_indices.html
```

Substitua/adicione caminhos para `ndre1‑4`, `ci_rededge` e `sipi` quando disponíveis.

Para uma composição RGB (true color) com nitidez máxima:

```bash
python scripts/render_truecolor_map.py \
  --red data/processed/<produto>/red.tif \
  --green data/processed/<produto>/green.tif \
  --blue data/processed/<produto>/blue.tif \
  --geojson dados/map.geojson \
  --sharpen \
  --tiles OpenStreetMap \
  --output mapas/truecolor.html
```

> Limite de resolução: os produtos Sentinel-2 oferecem pixels de 10 m; os filtros de nitidez ajudam a realçar contrastes, mas não criam detalhes além do que o sensor realmente capturou. Para imagens submétricas, utilize basemaps externos (Esri, Mapbox, etc.) ou dados comerciais.
### Exportar para CSV e dashboards
1) Mapa de um CSV específico
```bash
python scripts/render_csv_map.py \
  --csv tabelas/ndvi.csv \
  --geojson dados/map.geojson \
  --clip \
  --output mapas/ndvi_from_csv.html
```

Para alternar entre uso offline e um basemap de alta resolução (Esri World Imagery), utilize o seletor do mapa gerado. Se quiser forçar modo offline, use `--tiles none`; para uma visualização mais nítida online, use qualquer camada suportada (`--tiles OpenStreetMap`) e ative a camada “Esri World Imagery” diretamente no mapa. (O script adiciona automaticamente a camada Esri quando um tileset online é usado.)
2) Dashboard com todos os CSVs + true color
```bash
python scripts/render_csv_dashboard.py \
  --csv-dir tabelas \
  --truecolor-red data/processed/<produto>/red.tif \
  --truecolor-green data/processed/<produto>/green.tif \
  --truecolor-blue data/processed/<produto>/blue.tif \
  --geojson dados/map.geojson \
  --clip \
  --output mapas/dashboard_indices.html
```

3) True color com sobreposição alternável de índices
```bash
python scripts/render_truecolor_overlay_map.py \
  --csv-dir tabelas \
  --truecolor-red data/processed/<produto>/red.tif \
  --truecolor-green data/processed/<produto>/green.tif \
  --truecolor-blue data/processed/<produto>/blue.tif \
  --geojson dados/map.geojson \
  --clip \
  --indices ndvi ndmi \
  --output mapas/overlay_indices.html
```

## Workflow automatizado

Quando precisar executar todas as etapas de uma vez (download/extração, cálculo de índices, exportação para CSV e geração de mapas), use o utilitário integrado:

```bash
python scripts/run_full_workflow.py \
  --date 2025-10-20 \
  --geojson dados/map.geojson \
  --cloud 0 30 \
  --username "$SENTINEL_USERNAME" \
  --password "$SENTINEL_PASSWORD"
```

Por padrão ele:
- baixa a cena mais recente no intervalo informado (ou reaproveita um SAFE com `--safe-path`);
- calcula todos os índices definidos em `satellite_pipeline.py`;
- salva os CSVs em `tabelas/`;
- gera os mapas `mapas/ndvi.html`, `mapas/compare_indices.html`, `mapas/compare_indices_all.html`, `mapas/truecolor.html` e `mapas/ndvi_from_csv.html`.

Passe `--generate-overlay` se quiser incluir `mapas/overlay_indices.html` (arquivo grande com true color completa). Todos os parâmetros aceitam overrides (`--upsample`, `--smooth-radius`, `--tiles`, etc.), mantendo o mesmo comportamento dos scripts individuais.

## Estrutura do projeto
```
api/                 # Backend FastAPI (serve mapas/CSV e metadados)
dados/               # AOIs (GeoJSON) e insumos da análise
data/
- raw/               # Produtos SAFE baixados (ignorado no git)
- processed/         # Bandas extraídas e índices (ignorado no git)
mapas/               # HTMLs gerados (ignorado no git)
scripts/             # Scripts Python (download, processamento e renderização)
tabelas/             # CSVs exportados (ignorado no git)
web/                 # Aplicação web (Vite + React + Tailwind)

As bandas salvas incluem `blue`, `green`, `red`, `rededge1-4`, `nir`, `swir1` e `swir2`,
permitindo calcular índices baseados nas bandas red‑edge e SWIR do Sentinel‑2.
```

## Aplicação Web

Pré‑requisitos:
- Python 3.10+
- Node.js LTS + npm

Suba a API (terminal 1):
```bash
python -m venv .venv
source .venv/bin/activate   # PowerShell: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn api.server:app --reload --port 8000
```

Suba o frontend (terminal 2):
```bash
cd web
npm install
npm run dev
```

Abra `http://localhost:8080/analises`. O Vite já faz proxy de `/api`, `/mapas` e `/tabelas` para `http://127.0.0.1:8000`.

Se o mapa não carregar, gere os artefatos via workflow automatizado (seção anterior) ou renderize manualmente os mapas.

## Solução de problemas
- **Credenciais ausentes**: confirme variáveis de ambiente ou passe `--username`/`--password`.
- **Erro 401/403 ao consultar OData**: confira se o aplicativo OData API foi habilitado no portal do Copernicus Data Space e se o usuário aceitou os termos de uso; após a ativação pode levar alguns minutos para propagar.
- **Erro DAT-ZIP-111 / 422 ao baixar**: normalmente indica que o endpoint de download recebeu um UUID em formato incorreto; confirme que está usando `Products(<uuid>)/$value` (sem aspas) ou simplesmente deixe o script cuidar do download.
- **Nenhum produto encontrado**: ajuste intervalo de datas, cobertura de nuvens ou geometria do polígono.
- **Bandas ausentes**: verifique se o SAFE contém as bandas B04, B08 e B11; algumas cenas incompletas não incluem todas.
- **Erros de CRS/resolução**: o script reprojeta bandas automaticamente para a resolução da banda NIR (10 m). Use um SAFE íntegro para evitar incompatibilidades.

## Próximos passos
- Automatizar o pipeline (cron/notebook) para baixar cenas periodicamente e gerar séries temporais (NDVI, EVI, NDRE, NDMI).
- Enriquecer os indicadores com novos índices (SIPI, NDVIre, MCARI2) e estatísticas de anomalia por talhão.
- Integrar sensores adicionais (Landsat/ECOSTRESS para temperatura, SMAP/CHIRPS para umidade/chuva, Sentinel‑1 para estrutural) e combinar com o Sentinel‑2.
- Definir governança de armazenamento (rotina de limpeza dos SAFEs ou upload para bucket dedicado) e entrega de relatórios/alertas agronômicos automaticamente.

