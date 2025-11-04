import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, MapPin, Activity, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Dashboard de Monitoramento
          </h1>
          <p className="text-muted-foreground text-lg">
            Visão geral da saúde das suas lavouras com detecção inteligente de hotspots
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card-dark border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Alertas
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-alert-high" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                +3 nas últimas 24h
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card-dark border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Área Total Monitorada
              </CardTitle>
              <MapPin className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">248 ha</div>
              <p className="text-xs text-muted-foreground mt-1">
                32 talhões ativos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card-dark border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Área Afetada
              </CardTitle>
              <Activity className="h-4 w-4 text-alert-medium" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">15 ha</div>
              <p className="text-xs text-muted-foreground mt-1">
                6% da área total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card-dark border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Nível de Risco Médio
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-alert-high" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge className="bg-alert-high text-white text-lg px-3 py-1">
                  Alto
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Requer ação imediata
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-card-dark border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-alert-high" />
                Alertas Críticos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border hover:bg-card-dark-hover transition-colors">
                  <div>
                    <p className="font-medium">Praga - Talhão A-03</p>
                    <p className="text-sm text-muted-foreground">Detectado em 15/07/2024</p>
                  </div>
                  <Badge className="bg-alert-high text-white">ALTA</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border hover:bg-card-dark-hover transition-colors">
                  <div>
                    <p className="font-medium">Ferrugem - Talhão B-07</p>
                    <p className="text-sm text-muted-foreground">Detectado em 14/07/2024</p>
                  </div>
                  <Badge className="bg-alert-medium text-white">MÉDIA</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border hover:bg-card-dark-hover transition-colors">
                  <div>
                    <p className="font-medium">Estresse Hídrico - C-12</p>
                    <p className="text-sm text-muted-foreground">Detectado em 12/07/2024</p>
                  </div>
                  <Badge className="bg-alert-low text-white">BAIXA</Badge>
                </div>
              </div>
              <Link to="/analises">
                <Button className="w-full" variant="outline">
                  Ver Todos os Alertas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card-dark border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/analises">
                <Button className="w-full justify-start" variant="secondary" size="lg">
                  <MapPin className="mr-2 h-5 w-5" />
                  Ver Dashboard de Hotspots
                </Button>
              </Link>
              <Link to="/talhoes">
                <Button className="w-full justify-start" variant="secondary" size="lg">
                  <Activity className="mr-2 h-5 w-5" />
                  Comparar Talhões
                </Button>
              </Link>
              <Button className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                <TrendingUp className="mr-2 h-5 w-5" />
                + Novo Monitoramento
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="bg-card-dark border-border">
          <CardHeader>
            <CardTitle>Sobre o Sistema de Monitoramento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Índices Espectrais Monitorados</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>- <strong>NDVI, EVI, SAVI</strong> - Vigor e biomassa aérea</li>
                  <li>- <strong>NDRE, CI red-edge</strong> - Clorofila e estado nutricional</li>
                  <li>- <strong>NDWI, NDMI</strong> - Conteúdo de água no dossel</li>
                  <li>- <strong>MSI</strong> - Estresse hídrico</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Regras de Diagnóstico</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>- <strong>Regra 1</strong> - Seca provável: NDVI baixo + baixa chuva</li>
                  <li>- <strong>Regra 2</strong> - Estresse não hídrico: NDRE baixo com NDMI estável</li>
                  <li>- <strong>Regra 3</strong> - Área crítica: queda abrupta localizada</li>
                  <li>- <strong>Regra 4</strong> - Recuperação: subida após intervenção</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;

