import { useCallback, useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Bug, Droplet, Wind, CheckCircle, Search, Calendar, Play } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CompareMapResponse = { url: string };
type ProductsResponse = { products: string[] };
type IndicesResponse = { product: string; indices: Record<string, string> };

type JobStatusValue = "pending" | "running" | "succeeded" | "failed";

type JobResponse = {
  job_id: string;
  status: JobStatusValue;
  logs: string[];
  error: string | null;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  finished_at: string | null;
  return_code: number | null;
};

type AlertSeverity = "ALTA" | "MÉDIA" | "BAIXA" | "RESOLVIDO";
type AlertStatus = "active" | "resolved";

type AlertItem = {
  id: number;
  type: string;
  icon: LucideIcon;
  talhao: string;
  severity: AlertSeverity;
  severityColor: string;
  date: string;
  status: AlertStatus;
};

const alerts: AlertItem[] = [
  { id: 1, type: "Praga", icon: Bug, talhao: "Talhão A-03", severity: "ALTA", severityColor: "bg-alert-high", date: "15/07/2024", status: "active" },
  { id: 2, type: "Ferrugem", icon: Wind, talhao: "Talhão B-07", severity: "MÉDIA", severityColor: "bg-alert-medium", date: "14/07/2024", status: "active" },
  { id: 3, type: "Estresse Hídrico", icon: Droplet, talhao: "C-12", severity: "BAIXA", severityColor: "bg-alert-low", date: "12/07/2024", status: "active" },
  { id: 4, type: "Praga", icon: CheckCircle, talhao: "Talhão A-01", severity: "RESOLVIDO", severityColor: "bg-alert-resolved", date: "10/07/2024", status: "resolved" },
];

const JOB_STATUS_LABELS: Record<JobStatusValue, string> = {
  pending: "Na fila",
  running: "Em execução",
  succeeded: "Concluído",
  failed: "Falhou",
};

const Analises = () => {
  const [mapUrl, setMapUrl] = useState<string>("");
  const [mapError, setMapError] = useState<string>("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [products, setProducts] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState("");

  const [indices, setIndices] = useState<string[]>([]);
  const [indicesError, setIndicesError] = useState("");
  const [isLoadingIndices, setIsLoadingIndices] = useState(false);

  const [isLoadingMap, setIsLoadingMap] = useState(false);

  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatusValue | null>(null);
  const [jobLogs, setJobLogs] = useState<string[]>([]);
  const [jobError, setJobError] = useState<string>("");
  const [isTriggeringJob, setIsTriggeringJob] = useState(false);

  const hasProducts = products.length > 0;
  const jobStatusLabel = jobStatus ? JOB_STATUS_LABELS[jobStatus] : "Pronto para executar";
  const jobIsActive = jobStatus === "pending" || jobStatus === "running";

  const loadMap = useCallback(async (product: string | null) => {
    setMapError("");
    setMapUrl("");
    if (!hasProducts) {
      return;
    }
    setIsLoadingMap(true);
    const query = product ? `?product=${encodeURIComponent(product)}` : "";
    try {
      const res = await fetch(`/api/map/compare${query}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as CompareMapResponse;
      setMapUrl(data.url);
    } catch (err) {
      setMapError("Não foi possível carregar o mapa de comparação.");
    } finally {
      setIsLoadingMap(false);
    }
  }, [hasProducts]);

  const loadIndices = useCallback(async (product: string | null) => {
    setIndicesError("");
    setIsLoadingIndices(true);
    const query = product ? `?product=${encodeURIComponent(product)}` : "";
    try {
      const res = await fetch(`/api/indices${query}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as IndicesResponse;
      const names = Object.keys(data.indices || {}).sort();
      setIndices(names);
    } catch (err) {
      setIndices([]);
      setIndicesError("Não foi possível carregar a lista de índices.");
    } finally {
      setIsLoadingIndices(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setProductsError("");
    setIsLoadingProducts(true);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as ProductsResponse;
      const nextProducts = Array.isArray(data.products) ? data.products : [];
      setProducts(nextProducts);
      setSelectedProduct((prev) => {
        if (prev && nextProducts.includes(prev)) {
          return prev;
        }
        return null;
      });
      if (nextProducts.length === 0) {
        setMapUrl("");
        setIndices([]);
        setIndicesError("");
      }
    } catch (err) {
      setProducts([]);
      setSelectedProduct(null);
      setMapUrl("");
      setIndices([]);
      setIndicesError("");
      setProductsError("Não foi possível carregar a lista de produtos.");
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const fetchJobStatus = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/jobs/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as JobResponse;
      setJobStatus(data.status);
      setJobLogs(data.logs ?? []);
      setJobError(data.error ?? "");
    } catch (err) {
      setJobError("Não foi possível consultar o status da geração.");
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (isLoadingProducts) {
      return;
    }
    if (!hasProducts) {
      return;
    }
    const target = selectedProduct && products.includes(selectedProduct) ? selectedProduct : null;
    void loadMap(target);
    void loadIndices(target);
  }, [isLoadingProducts, hasProducts, products, selectedProduct, loadMap, loadIndices]);

  useEffect(() => {
    if (!jobId || !jobIsActive) {
      return;
    }
    const interval = setInterval(() => {
      void fetchJobStatus(jobId);
    }, 3000);
    return () => clearInterval(interval);
  }, [jobId, jobIsActive, fetchJobStatus]);

  useEffect(() => {
    if (jobStatus === "succeeded") {
      void loadProducts();
    }
  }, [jobStatus, loadProducts]);

  const applyFilters = () => {
    if (!hasProducts) {
      return;
    }
    const target = selectedProduct && products.includes(selectedProduct) ? selectedProduct : null;
    void loadMap(target);
    void loadIndices(target);
  };

  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    applyFilters();
  };

  const defaultDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const handleTriggerWorkflow = async () => {
    setJobError("");
    setIsTriggeringJob(true);

    const payload: Record<string, unknown> = {};
    if (startDate && endDate) {
      const range = [startDate, endDate].sort();
      payload.date_range = range;
    } else if (startDate) {
      payload.date = startDate;
    } else if (endDate) {
      payload.date = endDate;
    } else {
      payload.date = defaultDate;
    }
    payload.geojson = "dados/map.geojson";
    payload.cloud = [0, 30];
    payload.log_level = "INFO";

    try {
      const res = await fetch("/api/jobs/run-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try {
          const body = (await res.json()) as { detail?: string };
          if (body?.detail) {
            detail = body.detail;
          }
        } catch (error) {
          console.warn("Não foi possível interpretar resposta de erro do workflow", error);
        }
        throw new Error(detail);
      }
      const data = (await res.json()) as { job_id: string; status: JobStatusValue };
      setJobId(data.job_id);
      setJobStatus(data.status);
      setJobLogs([]);
      void fetchJobStatus(data.job_id);
    } catch (err) {
      const message = err instanceof Error && err.message ? err.message : "Não foi possível iniciar a geração da análise.";
      setJobError(message);
    } finally {
      setIsTriggeringJob(false);
    }
  };

  const totalAtivos = alerts.filter((a) => a.status === "active").length;
  const areaAfetadaHa = 15; // TODO: substituir por valor vindo da API
  const riscoMedioLabel = "Alto"; // TODO: calcular a partir de dados reais

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Análises</h1>
            <p className="text-muted-foreground">Mapa interativo com alternância de índices</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              value={selectedProduct ?? "latest"}
              onValueChange={(value) => {
                setSelectedProduct(value === "latest" ? null : value);
              }}
              disabled={isLoadingProducts || !hasProducts}
            >
              <SelectTrigger className="w-[260px] bg-background border-border">
                <SelectValue placeholder={isLoadingProducts ? "Carregando produtos..." : "Selecionar produto"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Mais recente disponível</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product} value={product}>
                    {product}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => void loadProducts()} disabled={isLoadingProducts}>
                {isLoadingProducts ? "Atualizando..." : "Recarregar"}
              </Button>
              <Button
                onClick={handleTriggerWorkflow}
                disabled={isTriggeringJob || jobIsActive}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                {isTriggeringJob ? "Enviando..." : "Gerar análise"}
              </Button>
            </div>
          </div>
        </div>
        {productsError && <p className="text-sm text-red-500">{productsError}</p>}

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-card-dark border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Alertas Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{totalAtivos}</div>
            </CardContent>
          </Card>

          <Card className="bg-card-dark border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Área Afetada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{areaAfetadaHa} ha</div>
            </CardContent>
          </Card>

          <Card className="bg-card-dark border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nível de Risco Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-alert-high text-white text-2xl px-4 py-2 font-bold">{riscoMedioLabel}</Badge>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card-dark border-border">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por talhão, ID ou palavra-chave"
                  className="pl-10 bg-background border-border"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Início</div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" className="pl-10 bg-background border-border" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Fim</div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" className="pl-10 bg-background border-border" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
              <div className="md:col-span-2 lg:col-span-4 flex gap-2 justify-end">
                <Button variant="secondary" onClick={applyFilters} disabled={!hasProducts}>
                  Aplicar filtros
                </Button>
                <Button variant="ghost" onClick={clearFilters} disabled={!hasProducts}>
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card-dark border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Mapa com alternância de índices</CardTitle>
              </CardHeader>
              <CardContent>
                {mapError && <div className="text-sm text-red-500 mb-3">{mapError}</div>}
                {isLoadingMap ? (
                  <div className="text-sm text-muted-foreground">Carregando mapa…</div>
                ) : hasProducts && mapUrl ? (
                  <iframe
                    title="compare-indices"
                    src={mapUrl}
                    className="w-full h-[75vh] rounded-md border border-border bg-background"
                  />
                ) : hasProducts ? (
                  <div className="text-sm text-muted-foreground">Selecione uma cena para visualizar o mapa.</div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Nenhum produto processado encontrado. Execute o workflow para gerar mapas.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card-dark border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Índices disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                {indicesError && <div className="text-sm text-red-500 mb-3">{indicesError}</div>}
                {isLoadingIndices ? (
                  <div className="text-sm text-muted-foreground">Carregando índices…</div>
                ) : hasProducts && indices.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {indices.map((indexName) => (
                      <Badge key={indexName} variant="outline" className="bg-background/50">
                        {indexName.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                ) : hasProducts ? (
                  <div className="text-sm text-muted-foreground">Nenhum índice encontrado para este produto.</div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Gere análises para listar os índices disponíveis.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card-dark border-border">
              <CardHeader>
                <CardTitle>Geração automatizada</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className={
                    jobStatus === "failed"
                      ? "bg-destructive text-destructive-foreground"
                      : jobStatus === "succeeded"
                      ? "bg-alert-resolved text-white"
                      : jobIsActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }>
                    {jobStatusLabel}
                  </Badge>
                </div>
                {jobError && <div className="text-sm text-red-500">{jobError}</div>}
                {jobId && (
                  <>
                    <p className="text-xs text-muted-foreground">Job ID: {jobId}</p>
                    <div className="max-h-48 overflow-auto rounded-md border border-border bg-background/40 p-3">
                      {jobLogs.length > 0 ? (
                        <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-muted-foreground">
                          {jobLogs.join("\n")}
                        </pre>
                      ) : (
                        <p className="text-xs text-muted-foreground">Aguardando registros…</p>
                      )}
                    </div>
                  </>
                )}
                {!jobId && (
                  <p className="text-xs text-muted-foreground">
                    Inicie uma nova geração para baixar a cena mais recente e atualizar os mapas.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-card-dark border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-alert-high" />
                  Alertas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((a) => {
                  const Icon = a.icon;
                  return (
                    <div
                      key={a.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        a.status === "active"
                          ? "border-l-alert-high bg-background/50"
                          : "border-l-alert-resolved bg-background/30"
                      } hover:bg-card-dark-hover transition-colors`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-alert-high" />
                          <div>
                            <p className="font-semibold">{a.type} - {a.talhao}</p>
                            <p className="text-xs text-muted-foreground">Detectado em: {a.date}</p>
                          </div>
                        </div>
                        <Badge className={`${a.severityColor} text-white text-xs`}>{a.severity}</Badge>
                      </div>
                      <Button variant="secondary" size="sm" className="w-full mt-2 bg-primary/20 text-primary hover:bg-primary/30">
                        Ver detalhes
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analises;
