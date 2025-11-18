import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const mainNavItems = [
  { icon: "/images/ic_dashboard.svg", label: "Dashboard", to: "/analises", active: true },
  { icon: "/images/ic_mapa_interativo.svg", label: "Mapa Interativo", to: "/analises" },
];

const collapsibleNav = [
  {
    key: "monitoramento",
    icon: "/images/ic_monitoramento.svg",
    label: "Monitoramento",
    items: [
      { label: "Insights", to: "/monitoramento/insights" },
      { label: "Alertas", to: "/monitoramento/alertas" },
      { label: "Séries temporais", to: "/monitoramento/series-temporais" },
      { label: "Diagnósticos", to: "/monitoramento/diagnosticos" },
      { label: "Relatórios", to: "/monitoramento/relatorios" },
    ],
  },
  {
    key: "propriedades",
    icon: "/images/ic_propriedades.svg",
    label: "Propriedades",
    items: [
      { label: "Talhões", to: "/propriedades/talhoes" },
      { label: "Culturas", to: "/propriedades/culturas" },
    ],
  },
];

const trailingNavItems = [{ icon: "/images/ic_dados_satelitais.svg", label: "Dados Satelitais", to: "/talhoes" }];

const collapsedNavItems = [
  ...mainNavItems,
  ...collapsibleNav.map(({ icon, label, items }) => ({
    icon,
    label,
    to: items[0]?.to ?? "/dashboard",
  })),
  ...trailingNavItems,
];

const utilityItems = [
  { icon: "/images/ic_documentacao.svg", label: "Documentação" },
  { icon: "/images/ic_suporte.svg", label: "Suporte" },
  { icon: "/images/ic_configuracoes.svg", label: "Configurações" },
];

const Dashboard = () => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    monitoramento: true,
    propriedades: true,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderToggleButton = (
    expanded: boolean,
    positionClass = "top-1/2 -translate-y-1/2",
    rightOffsetClass = "-right-[18px]",
  ) => (
    <button
      type="button"
      onClick={() => setIsSidebarExpanded(!expanded)}
      className={`absolute ${rightOffsetClass} flex h-8 w-8 items-center justify-center text-slate-500 transition hover:text-slate-900 focus-visible:outline-none ${positionClass}`}
      aria-label={expanded ? "Recolher menu" : "Expandir menu"}
    >
      <img
        src="/images/ic_arrow_hide_menu.svg"
        alt=""
        className={`h-6 w-6 transition-transform ${expanded ? "rotate-180" : ""}`}
      />
    </button>
  );

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      {isSidebarExpanded ? (
        <aside className="relative flex w-72 flex-col border-r border-[#EAEEF4] bg-white px-5 py-6">
          <div className="flex items-center">
            <img src="/images/ic_atmosAgro_full.svg" alt="AtmosAgro" className="h-10 w-auto" />
          </div>
          <div className="relative mt-5 flex w-full items-center justify-center py-3">
            <div className="h-[1px] w-full bg-[#CBCAD7]" />
            {renderToggleButton(true, "top-1/2 -translate-y-1/2", "-right-[36px]")}
          </div>

          <nav className="mt-5 flex flex-1 flex-col gap-4 text-sm">
            <div className="flex flex-col gap-2">
              {mainNavItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-[10px] px-3 py-2 font-semibold transition ${
                    item.active ? "bg-[#121826] text-white" : "text-slate-500 hover:bg-[#F0F0F0] hover:text-slate-900"
                  }`}
                >
                  <img src={item.icon} alt="" className={`h-6 w-6 transition ${item.active ? "brightness-0 invert" : ""}`} />
                  {item.label}
                </Link>
              ))}
            </div>

            {collapsibleNav.map((section) => {
              const open = expandedSections[section.key];
              return (
                <div key={section.key}>
                  <button
                    type="button"
                    onClick={() => toggleSection(section.key)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-semibold text-slate-600 transition hover:bg-[#F0F0F0] hover:text-slate-900"
                    aria-expanded={open}
                  >
                    <span className="flex items-center gap-3">
                      <img src={section.icon} alt="" className="h-6 w-6" />
                      {section.label}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition ${open ? "" : "-rotate-90"}`} />
                  </button>
                  {open && (
                    <div className="ml-8 mt-1 flex flex-col gap-1 border-l border-slate-200 pl-4 text-slate-500">
                      {section.items.map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          className="rounded-md px-2 py-1 text-sm transition hover:bg-[#F0F0F0] hover:text-slate-900"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {trailingNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center gap-3 rounded-2xl px-3 py-2 font-semibold text-slate-600 transition hover:bg-[#F0F0F0] hover:text-slate-900"
              >
                <img src={item.icon} alt="" className="h-6 w-6" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 flex flex-col gap-2 text-sm font-medium">
            {utilityItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-slate-500 transition hover:bg-[#F0F0F0] hover:text-slate-900"
              >
                <img src={item.icon} alt="" className="h-6 w-6" />
                {item.label}
              </button>
            ))}

            <div className="mt-2 rounded-2xl bg-[#F0F0F0] p-3">
              <p className="text-xs font-semibold text-slate-500">Tema</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setThemeMode("light")}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    themeMode === "light" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Claro
                </button>
                <button
                  type="button"
                  onClick={() => setThemeMode("dark")}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    themeMode === "dark" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Escuro
                </button>
              </div>
            </div>
          </div>
        </aside>
      ) : (
        <aside className="relative flex w-[88px] flex-col items-center border-r border-[#EAEEF4] bg-white py-6">
          <div className="flex items-center justify-center">
            <img src="/images/ic_atmos_agro_svg.svg" alt="AtmosAgro" className="h-10 w-10" />
          </div>
          <div className="relative mt-4 flex w-full items-center justify-center py-3">
            <div className="h-[1px] w-10 bg-[#CBCAD7]" />
            {renderToggleButton(false, "top-1/2 -translate-y-1/2")}
          </div>

          <nav className="mt-6 flex flex-col items-center gap-4">
            {collapsedNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`flex h-10 w-10 items-center justify-center rounded-[10px] transition-colors ${
                  item.active ? "bg-[#242B36] text-white" : "text-slate-400 hover:bg-[#F0F0F0] hover:text-slate-900"
                }`}
                aria-label={item.label}
              >
                <img src={item.icon} alt="" className={`h-6 w-6 transition ${item.active ? "invert" : ""}`} />
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col items-center gap-2">
            {utilityItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-[#F0F0F0] hover:text-slate-900"
                aria-label={item.label}
              >
                <img src={item.icon} alt="" className="h-6 w-6" />
              </button>
            ))}
            <div className="flex w-12 flex-col items-center gap-2 rounded-[10px] bg-[#F0F0F0] p-2 text-slate-500">
              <button
                type="button"
                onClick={() => setThemeMode("light")}
                className={`flex h-10 w-10 items-center justify-center rounded-[10px] transition ${
                  themeMode === "light" ? "bg-white shadow-sm" : ""
                }`}
                aria-label="Tema claro"
              >
                <img src="/images/ic_light.svg" alt="Tema claro" className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => setThemeMode("dark")}
                className={`flex h-10 w-10 items-center justify-center rounded-[10px] transition ${
                  themeMode === "dark" ? "bg-white shadow-sm" : ""
                }`}
                aria-label="Tema escuro"
              >
                <img src="/images/ic_dark.svg" alt="Tema escuro" className="h-6 w-6" />
              </button>
            </div>
          </div>
        </aside>
      )}

      <main className="flex flex-1 flex-col px-8 py-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">Atmos Agro</p>
            <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          </div>
          <div className="flex items-center">
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F0F0]">
              <img src="/images/ic_notificacao.svg" alt="Notificações" className="h-6 w-6" />
            </button>
            <div className="mx-[15px] h-5 w-[1px] bg-[#CBCAD7]" />
            <div className="flex items-center gap-3 rounded-full border border-slate-200 px-3 py-1.5">
              <img src="/images/ic_perfil.svg" alt="Usuário" className="h-8 w-8 rounded-full" />
              <div className="text-left">
                <p className="text-sm font-semibold">Andrew Smith</p>
                <p className="text-xs text-slate-500">Administrador</p>
              </div>
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-500" aria-hidden="true">
                <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </header>

        <section className="mt-10 flex flex-1 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50">
          <p className="text-slate-400">Conteúdo principal será exibido aqui.</p>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
