import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Satellite, TrendingUp, Activity, MapPin, AlertCircle, BarChart3, Eye, Shield, ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="border-b border-border bg-card-dark/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Cana-Virus</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/login">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-2 text-sm">
            Monitoramento Inteligente de Lavouras
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Detecte problemas nas suas lavouras {" "}
            <span className="text-primary">antes que seja tarde</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Use o poder das imagens de satélite e algoritmos para monitorar a saúde das suas plantações em tempo real. Identifique pragas, doenças e estresse hídrico com precisão.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/login">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Ver Demonstração
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 justify-center items-center pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Sem necessidade de cartão</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span>Resultados em tempo real</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <span>Fácil de usar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20 bg-card-dark/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Monitoramento Completo e Inteligente
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Nossa plataforma utiliza índices espectrais avançados para diagnosticar problemas com precisão científica
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card-dark border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <Satellite className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Imagens de Satélite</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitoramento contínuo com imagens de alta resolução. Acompanhe a evolução da sua lavoura dia após dia.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card-dark border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <Activity className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Índices Espectrais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  NDVI, NDRE, NDWI, NDMI e outros indicadores para avaliar vigor, clorofila e água no dossel.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card-dark border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <AlertCircle className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Alertas Inteligentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Identifique áreas críticas automaticamente e priorize as ações de manejo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Resultados que importam</h2>
          <p className="text-muted-foreground text-lg">Ganhe visibilidade, reduza perdas e aumente a produtividade.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="bg-card-dark border-border">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary" />
              <CardTitle>Rastreie indicadores</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Acompanhe séries temporais por talhão e por índice.</CardContent>
          </Card>
          <Card className="bg-card-dark border-border">
            <CardHeader>
              <MapPin className="h-8 w-8 text-primary" />
              <CardTitle>Delimite áreas</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Analise somente onde importa com polígonos GeoJSON.</CardContent>
          </Card>
          <Card className="bg-card-dark border-border">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary" />
              <CardTitle>Priorize ações</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Direcione equipes para os hotspots com maior impacto.</CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 bg-primary/5 rounded-2xl my-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">
            Pronto para transformar o manejo da sua lavoura?
          </h2>
          <p className="text-xl text-muted-foreground">
            Junte-se aos agricultores que já usam tecnologia de ponta para aumentar a produtividade e reduzir perdas.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 py-6">
              Começar Agora - 100% Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card-dark/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-semibold">Cana-Virus</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Cana-Virus. Monitoramento inteligente de lavouras.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

