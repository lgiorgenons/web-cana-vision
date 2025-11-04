import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Bug, Droplet, Wind, CheckCircle } from "lucide-react";

const alerts = [
  {
    id: 1,
    type: "Praga",
    icon: Bug,
    talhao: "Talhão A-03",
    severity: "ALTA",
    severityColor: "bg-alert-high",
    date: "15/07/2024",
    status: "active",
  },
  {
    id: 2,
    type: "Ferrugem",
    icon: Wind,
    talhao: "Talhão B-07",
    severity: "MÉDIA",
    severityColor: "bg-alert-medium",
    date: "14/07/2024",
    status: "active",
  },
  {
    id: 3,
    type: "Estresse Hídrico",
    icon: Droplet,
    talhao: "C-12",
    severity: "BAIXA",
    severityColor: "bg-alert-low",
    date: "12/07/2024",
    status: "active",
  },
  {
    id: 4,
    type: "Praga",
    icon: CheckCircle,
    talhao: "Talhão A-01",
    severity: "RESOLVIDO",
    severityColor: "bg-alert-resolved",
    date: "10/07/2024",
    status: "resolved",
  },
];

const Hotspots = () => {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard de Hotspots</h1>
          <p className="text-muted-foreground text-lg">
            Visualize e monitore áreas críticas detectadas via satélite
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-card-dark border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Alertas Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">12</div>
            </CardContent>
          </Card>

          <Card className="bg-card-dark border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Área Afetada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">15 ha</div>
            </CardContent>
          </Card>

          <Card className="bg-card-dark border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Nível de Risco Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-alert-high text-white text-2xl px-4 py-2 font-bold">
                Alto
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card-dark border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por talhão ou ID"
                  className="pl-10 bg-background border-border"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary">Data</Button>
                <Button variant="secondary">Tipo de Alerta</Button>
                <Button variant="secondary">Status</Button>
                <Button variant="secondary">Personalizado</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <Card className="bg-card-dark border-border h-[600px]">
              <CardContent className="p-0 h-full relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🗺️</div>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold">Mapa de Hotspots</p>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Visualização interativa com sobreposição de calor mostrando áreas críticas detectadas
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts List */}
          <div>
            <Card className="bg-card-dark border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Lista de Alertas</CardTitle>
                <Button size="sm" className="bg-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((alert) => {
                  const Icon = alert.icon;
                  return (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        alert.status === "active"
                          ? "border-l-alert-high bg-background/50"
                          : "border-l-alert-resolved bg-background/30"
                      } hover:bg-card-dark-hover transition-colors`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${
                            alert.severity === "ALTA" ? "text-alert-high" :
                            alert.severity === "MÉDIA" ? "text-alert-medium" :
                            alert.severity === "BAIXA" ? "text-alert-low" :
                            "text-alert-resolved"
                          }`} />
                          <div>
                            <p className="font-semibold">{alert.type} - {alert.talhao}</p>
                            <p className="text-xs text-muted-foreground">
                              Detectado em: {alert.date}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${alert.severityColor} text-white text-xs`}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full mt-2 bg-primary/20 text-primary hover:bg-primary/30"
                      >
                        {alert.status === "active" ? "Ver Detalhes" : "Ver Histórico"}
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

export default Hotspots;

