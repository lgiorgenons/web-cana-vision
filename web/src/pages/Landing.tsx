import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Globe2,
  Layers,
  Leaf,
  Mouse,
  Scan,
  ShieldCheck,
  Sprout,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Landing = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeAccordion, setActiveAccordion] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const accordionItems = [
    {
      title: "Mapeamento de Talhões",
      desc: "Importe seus mapas KML/Shapefile em segundos e visualize sua propriedade com precisão de centímetros.",
      image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Monitoramento de Pragas",
      desc: "Identifique focos de Sphenophorus e Broca com nossa IA antes que eles se espalhem.",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Análise Nutricional (NDRE)",
      desc: "Mapas de clorofila para aplicação de nitrogênio em taxa variável. Economize insumos.",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Relatórios Automáticos",
      desc: "Gere relatórios de conformidade e produtividade em PDF/Excel com um único clique.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-500/30">
      {/* Navbar (Sticky & Adaptive) */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 transition-all duration-300 md:px-12 ${
          isScrolled ? "bg-slate-950/90 py-4 shadow-md backdrop-blur-md" : "bg-transparent py-6"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/images/ic_atmosAgro_full_white.svg" alt="AtmosAgro" className="h-8" />
        </div>
        
        {/* Center Links (Desktop) */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#solutions" className="text-[16px] font-normal text-white transition hover:text-slate-200">Soluções</a>
          <a href="#technology" className="text-[16px] font-normal text-white transition hover:text-slate-200">Tecnologia</a>
          <a href="#about" className="text-[16px] font-normal text-white transition hover:text-slate-200">Sobre</a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
           <Link to="/login" className="hidden text-sm font-medium text-white transition hover:text-[#34A853] md:block">
             Log in
           </Link>
           <Link to="/app">
             <Button className="h-10 rounded-full bg-[#34A853] px-6 text-sm font-bold text-white hover:bg-[#2E9648] shadow-lg shadow-[#34A853]/20">
               Dashboard
             </Button>
           </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex h-screen flex-col justify-center pb-24 pl-4 pr-4 md:pl-20">
        {/* Background Image (Full Screen) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/img_hero.png"
            alt="Sugarcane Field Top View"
            className="h-full w-full object-cover brightness-[0.60]"
          />
        </div>

        {/* Content (Left Aligned, Bottom) */}
        <div className="relative z-10 max-w-full text-center px-4">
          {/* Headline */}
          <h1 className="text-5xl font-normal tracking-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl leading-[1.1]">
            Monitoramento de <br />
            <span className="text-[#34A853] drop-shadow-md">Cana-de-Açúcar</span> com <br />
            Inteligência Artificial
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-100 drop-shadow-md leading-relaxed font-normal">
            Desbloqueie o potencial da sua lavoura. Explore técnicas avançadas para aumentar a produtividade e conectar-se com a terra através de dados precisos.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/app">
              <Button size="lg" className="h-14 rounded-full bg-[#34A853] px-10 text-lg font-bold text-white hover:bg-[#2E9648] transition-transform hover:scale-105 shadow-lg shadow-[#34A853]/20">
                Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 rounded-full border-white bg-transparent px-10 text-lg font-bold text-white hover:bg-white hover:text-slate-900 transition-all">
              Saiba Mais
            </Button>
          </div>
          
        </div>

        {/* Mouse Scroll Indicator */}
        <div 
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 cursor-pointer flex-col items-center gap-2 text-white opacity-70 transition-opacity hover:opacity-100 md:flex"
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
        >
            <Mouse className="h-8 w-8 animate-bounce" />
            <span className="text-xs font-medium tracking-widest uppercase">Explore Mais</span>
        </div>
      </section>

      {/* Stats/Features Row */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 md:grid-cols-4">
            {[
              {
                icon: Globe2,
                title: "Monitoramento 24/7",
                desc: "Acesso a dados de satélite atualizados diariamente para tomada de decisão rápida.",
              },
              {
                icon: Scan,
                title: "Precisão de 98%",
                desc: "Algoritmos de IA calibrados especificamente para a cultura da cana-de-açúcar.",
              },
              {
                icon: Zap,
                title: "Alertas em Tempo Real",
                desc: "Receba notificações automáticas sobre riscos de pragas e doenças no seu celular.",
              },
              {
                icon: Layers,
                title: "Cobertura Total",
                desc: "Escalabilidade para monitorar de pequenos talhões a grandes usinas.",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#34A853]/10 text-[#34A853]">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Como funciona a <br />
                <span className="text-emerald-600">Inteligência AtmosAgro?</span>
              </h2>
            </div>
            <p className="max-w-md text-lg text-slate-600">
              Transformamos dados complexos em insights simples e acionáveis para o seu dia a dia no campo.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Card 1 */}
            <div className="group relative overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
              <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#34A853]/10 text-[#34A853]">
                <Layers className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-slate-900">1. Coleta e Processamento</h3>
              <p className="mb-8 text-slate-500">
                Nossa plataforma ingere automaticamente imagens dos satélites Sentinel-2, Landsat e Planet. 
                Processamos correções atmosféricas e removemos nuvens para garantir a melhor visualização.
              </p>
              <div className="relative h-64 w-full overflow-hidden rounded-3xl bg-slate-100">
                 <img 
                   src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"
                   className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                   alt="Satellite Data"
                 />
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-10 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
              <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#34A853]/20 text-[#34A853]">
                <BarChart3 className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white">2. Diagnóstico e Ação</h3>
              <p className="mb-8 text-slate-400">
                Algoritmos de IA identificam padrões de estresse hídrico, pragas e deficiências nutricionais.
                Você recebe um mapa de calor com as áreas que precisam de atenção imediata.
              </p>
              <div className="relative h-64 w-full overflow-hidden rounded-3xl bg-slate-800 border border-white/10">
                <img 
                   src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
                   className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                   alt="Data Analysis"
                 />
                 {/* Overlay Card */}
                 <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#34A853] animate-pulse" />
                      <p className="text-sm font-medium text-white">Análise Concluída: Talhão 7</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 max-w-3xl">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Simplifique a gestão e <br />
              <span className="text-emerald-600">aumente a produtividade.</span>
            </h2>
            <div className="mt-8 flex items-center gap-2 text-[#34A853] font-medium cursor-pointer hover:underline">
              VER TODOS OS RECURSOS <ChevronRight className="h-4 w-4" />
            </div>
          </div>

          <div className="grid gap-16 lg:grid-cols-2">
            {/* Accordion List */}
            <div className="space-y-4">
              {accordionItems.map((item, i) => (
                <div 
                  key={i} 
                  className={`cursor-pointer border-b border-slate-100 py-6 transition-all ${
                    activeAccordion === i ? "opacity-100" : "opacity-50 hover:opacity-80"
                  }`}
                  onClick={() => setActiveAccordion(i)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                    <ChevronRight className={`h-5 w-5 transition-transform ${activeAccordion === i ? "rotate-90 text-[#34A853]" : "text-slate-400"}`} />
                  </div>
                  <div className={`grid transition-all duration-300 ease-in-out ${
                    activeAccordion === i ? "grid-rows-[1fr] mt-4 opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}>
                    <div className="overflow-hidden">
                      <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Image */}
            <div className="relative h-[500px] overflow-hidden rounded-[2.5rem] shadow-2xl">
              {accordionItems.map((item, i) => (
                <img
                  key={i}
                  src={item.image}
                  alt={item.title}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                    activeAccordion === i ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              {/* Floating Badge */}
              <div className="absolute bottom-8 left-8 rounded-xl bg-white/90 p-4 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#34A853]/10 text-[#34A853]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Status</p>
                    <p className="text-sm font-bold text-slate-900">Otimizado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid (Sustainability) */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#34A853]/20 bg-[#34A853]/10 px-3 py-1 text-sm font-medium text-[#34A853]">
              <Leaf className="h-4 w-4" />
              Sustentabilidade
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Construindo cadeias de suprimentos <br />
              <span className="text-emerald-600">mais verdes para o futuro.</span>
            </h2>
          </div>

          <div className="grid h-auto gap-6 md:grid-cols-4 md:grid-rows-2 lg:h-[600px]">
            {/* Card 1: Dark Brand */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl md:col-span-1 md:row-span-2">
              <div className="relative z-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#34A853] text-slate-950">
                  <Leaf className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">AtmosAgro <br />Carbon Zero</h3>
                <p className="mt-4 text-slate-400">Compromisso com a redução da pegada de carbono no agronegócio.</p>
              </div>
              <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-[#34A853]/20 blur-3xl" />
            </div>

            {/* Card 2: Image */}
            <div className="relative overflow-hidden rounded-[2rem] shadow-xl md:col-span-2 md:row-span-1">
              <img 
                src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1000&auto=format&fit=crop" 
                alt="Sustainable Field"
                className="h-full w-full object-cover transition-transform hover:scale-105 duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <p className="font-bold text-white">Mapeamento e Colaboração</p>
              </div>
            </div>

            {/* Card 3: Light Stats */}
            <div className="flex flex-col justify-center rounded-[2rem] bg-emerald-50 p-8 shadow-xl md:col-span-1 md:row-span-1">
              <h3 className="text-lg font-bold text-[#34A853]">Risco e Compliance</h3>
              <div className="mt-4 flex items-end gap-2">
                <div className="h-16 w-4 rounded-t-lg bg-emerald-200" />
                <div className="h-24 w-4 rounded-t-lg bg-emerald-300" />
                <div className="h-32 w-4 rounded-t-lg bg-emerald-500" />
                <div className="h-20 w-4 rounded-t-lg bg-emerald-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-[#34A853]">+45% Eficiência</p>
            </div>

            {/* Card 4: Image Drone */}
            <div className="relative overflow-hidden rounded-[2rem] shadow-xl md:col-span-3 md:row-span-1">
               <img 
                src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1000&auto=format&fit=crop" 
                alt="Drone Technology"
                className="h-full w-full object-cover transition-transform hover:scale-105 duration-700"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Agro News Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Notícias do Agro</h2>
            <Button variant="outline" className="rounded-full">Ver todas</Button>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                tag: "Mercado",
                date: "21 Nov 2024",
                title: "Preço da cana-de-açúcar atinge recorde histórico com alta demanda de etanol.",
                image: "https://images.unsplash.com/photo-1598155523122-3842334d6c10?q=80&w=800&auto=format&fit=crop"
              },
              {
                tag: "Tecnologia",
                date: "20 Nov 2024",
                title: "Nova IA da AtmosAgro promete reduzir uso de defensivos em até 30%.",
                image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop"
              },
              {
                tag: "Clima",
                date: "19 Nov 2024",
                title: "Previsão de chuvas para o próximo trimestre anima produtores do Centro-Sul.",
                image: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?q=80&w=800&auto=format&fit=crop"
              }
            ].map((news, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="mb-4 overflow-hidden rounded-2xl">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="font-semibold text-[#34A853]">{news.tag}</span>
                  <span>•</span>
                  <span>{news.date}</span>
                </div>
                <h3 className="mt-2 text-xl font-bold text-slate-900 group-hover:text-[#34A853] transition-colors">
                  {news.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-16 text-slate-400">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-slate-950">
                  <Leaf className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold">AtmosAgro</span>
              </div>
              <p className="mt-6 text-sm leading-relaxed">
                Transformando cadeias de suprimentos globais para um futuro livre de desmatamento e mais produtivo.
              </p>
              <div className="mt-6 flex gap-4">
                {/* Social Placeholders */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-slate-800 hover:bg-[#34A853] transition-colors cursor-pointer" />
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="mb-6 font-bold text-white">Plataforma</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-[#34A853] transition-colors">CanaVision</a></li>
                <li><a href="#" className="hover:text-[#34A853] transition-colors">SojaVision</a></li>
                <li><a href="#" className="hover:text-[#34A853] transition-colors">BioClima</a></li>
                <li><a href="#" className="hover:text-[#34A853] transition-colors">Integrações</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 font-bold text-white">Empresa</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-[#34A853] transition-colors">Sobre nós</a></li>
                <li><a href="#" className="hover:text-[#34A853] transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-[#34A853] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#34A853] transition-colors">Imprensa</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 font-bold text-white">Recursos</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-[#34A853] transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-[#34A853] transition-colors">Documentação API</a></li>
                <li><a href="#" className="hover:text-[#34A853] transition-colors">Status do Sistema</a></li>
                <li><a href="#" className="hover:text-[#34A853] transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 flex flex-col items-center justify-between border-t border-slate-800 pt-8 text-xs sm:flex-row">
            <p>© 2024 AtmosAgro. Todos os direitos reservados.</p>
            <div className="mt-4 flex gap-6 sm:mt-0">
              <a href="#" className="hover:text-white">Política de Privacidade</a>
              <a href="#" className="hover:text-white">Termos de Uso</a>
              <a href="#" className="hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
