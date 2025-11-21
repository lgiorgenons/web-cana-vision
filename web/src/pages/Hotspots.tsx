import { useMemo, useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Droplets,
  Leaf,
  Layers,
  Maximize2,
  Scan,
  Sprout,
  Thermometer,
  Wind,
  X,
} from "lucide-react";

type Field = {
  id: string;
  name: string;
  crop: string;
  health: number;
  healthLabel: "Good" | "Low" | "Alert";
  layer: string;
  area: string;
  lastImage: string;
  trend: string;
  ndvi: string;
  ndre: string;
  ndmi: string;
  evi: string;
  soilMoisture: string;
  productivity: string;
  alerts: string[];
  position: { left: string; top: string; width: string; height: string; rotate?: string };
  nextHarvest: string;
  daysToHarvest: number;
  cloudCover: string;
  productId: string;
  lst: string;
  rainfall: string;
  ndwi: string;
  pestRisk: "High" | "Medium" | "Low";
};

const currentScene = {
  productId: "S2B_MSIL2A_20240815",
  captureDate: "15/08/2024",
  cloudCover: "8%",
  resolution: "10 m",
  indices: ["NDVI", "EVI", "NDRE", "NDMI", "True Color"],
};

const fields: Field[] = [
  {
    id: "talhao-1",
    name: "Talhao 1",
    crop: "Cana-de-acucar (RB867515)",
    health: 0.95,
    healthLabel: "Good",
    layer: "NDVI",
    area: "18 ha",
    lastImage: "15/08/2024",
    trend: "+3% vs ultima captura",
    ndvi: "0.81",
    ndre: "0.62",
    ndmi: "0.49",
    evi: "0.68",
    soilMoisture: "71%",
    productivity: "78 t/ha",
    alerts: ["Vigor consistente"],
    position: { left: "14%", top: "16%", width: "33%", height: "28%", rotate: "-1deg" },
    nextHarvest: "29/09/2024",
    daysToHarvest: 45,
    cloudCover: "8%",
    productId: "S2B_MSIL2A_20240815",
    lst: "28°C",
    rainfall: "45mm",
    ndwi: "0.35",
    pestRisk: "Low",
  },
  {
    id: "talhao-2",
    name: "Talhao 2",
    crop: "Cana-de-acucar (CTC4)",
    health: 0.74,
    healthLabel: "Low",
    layer: "NDRE",
    area: "11 ha",
    lastImage: "15/08/2024",
    trend: "-2% vs ultima captura",
    ndvi: "0.64",
    ndre: "0.41",
    ndmi: "0.34",
    evi: "0.55",
    soilMoisture: "63%",
    productivity: "65 t/ha",
    alerts: ["Queda leve de vigor", "Verificar bordadura leste"],
    position: { left: "52%", top: "18%", width: "26%", height: "24%", rotate: "1deg" },
    nextHarvest: "15/10/2024",
    daysToHarvest: 61,
    cloudCover: "8%",
    productId: "S2B_MSIL2A_20240815",

    lst: "29°C",
    rainfall: "42mm",
    ndwi: "0.15",
    pestRisk: "High",
  },
  {
    id: "talhao-3",
    name: "Talhao 3",
    crop: "Cana-de-acucar (RB966928)",
    health: 0.98,
    healthLabel: "Good",
    layer: "NDMI",
    area: "15 ha",
    lastImage: "15/08/2024",
    trend: "+1.2% vs ultima captura",
    ndvi: "0.78",
    ndre: "0.58",
    ndmi: "0.52",
    evi: "0.63",
    soilMoisture: "76%",
    productivity: "74 t/ha",
    alerts: [],
    position: { left: "18%", top: "50%", width: "30%", height: "26%", rotate: "-2deg" },
    nextHarvest: "05/09/2024",
    daysToHarvest: 21,
    cloudCover: "8%",
    productId: "S2B_MSIL2A_20240815",
    lst: "27°C",
    rainfall: "50mm",
    ndwi: "0.38",
    pestRisk: "Low",
  },
  {
    id: "talhao-4",
    name: "Talhao 4",
    crop: "Cana-de-acucar (CTC9001)",
    health: 0.87,
    healthLabel: "Good",
    layer: "EVI",
    area: "9 ha",
    lastImage: "15/08/2024",
    trend: "-0.5% vs ultima captura",
    ndvi: "0.72",
    ndre: "0.51",
    ndmi: "0.45",
    evi: "0.58",
    soilMoisture: "68%",
    productivity: "70 t/ha",
    alerts: [],
    position: { left: "56%", top: "52%", width: "26%", height: "30%", rotate: "2deg" },
    nextHarvest: "20/11/2024",
    daysToHarvest: 96,
    cloudCover: "8%",
    productId: "S2B_MSIL2A_20240815",
    lst: "29°C",
    rainfall: "40mm",
    ndwi: "0.32",
    pestRisk: "Low",
  },
  {
    id: "talhao-5",
    name: "Talhao 5",
    crop: "Cana-de-acucar",
    health: 0.95,
    healthLabel: "Good",
    layer: "NDVI",
    area: "22 ha",
    lastImage: "15/08/2024",
    trend: "Estavel",
    ndvi: "0.79",
    ndre: "0.60",
    ndmi: "0.50",
    evi: "0.66",
    soilMoisture: "74%",
    productivity: "76 t/ha",
    alerts: [],
    position: { left: "85%", top: "60%", width: "15%", height: "20%", rotate: "0deg" },
    nextHarvest: "10/10/2024",
    daysToHarvest: 56,
    cloudCover: "8%",
    productId: "S2B_MSIL2A_20240815",
    lst: "28°C",
    rainfall: "48mm",
    ndwi: "0.36",
    pestRisk: "Low",
  },
  {
    id: "talhao-6",
    name: "Talhao 6",
    crop: "Cana-de-acucar",
    health: 0.89,
    healthLabel: "Good",
    layer: "NDVI",
    area: "14 ha",
    lastImage: "15/08/2024",
    trend: "+1%",
    ndvi: "0.75",
    ndre: "0.55",
    ndmi: "0.48",
    evi: "0.60",
    soilMoisture: "70%",
    productivity: "72 t/ha",
    alerts: [],
    position: { left: "85%", top: "35%", width: "15%", height: "20%", rotate: "0deg" },
    nextHarvest: "12/09/2024",
    daysToHarvest: 28,
    cloudCover: "8%",
    productId: "S2B_MSIL2A_20240815",
    lst: "28°C",
    rainfall: "44mm",
    ndwi: "0.34",
    pestRisk: "Low",
  },
  {
    id: "talhao-7",
    name: "Talhao 7",
    crop: "Cana-de-acucar",
    health: 0.52,
    healthLabel: "Alert",
    layer: "NDVI",
    area: "8 ha",
    lastImage: "15/08/2024",
    trend: "-5%",
    ndvi: "0.45",
    ndre: "0.30",
    ndmi: "0.25",
    evi: "0.38",
    soilMoisture: "52%",
    productivity: "45 t/ha",
    alerts: ["Alerta: estresse hidrico", "Inspecionar pragas"],
    position: { left: "85%", top: "10%", width: "15%", height: "20%", rotate: "0deg" },
    nextHarvest: "30/11/2024",
    daysToHarvest: 106,
    cloudCover: "8%",
    productId: "S2B_MSIL2A_20240815",
    lst: "38°C",
    rainfall: "5mm",
    ndwi: "-0.10",
    pestRisk: "High",
  },
  {
    id: "talhao-8",
    name: "Talhao 8",
    crop: "Cana-de-acucar",
    health: 0.81,
    healthLabel: "Good",
    layer: "NDVI",
    area: "12 ha",
    lastImage: "15/08/2024",
    trend: "Estavel",
    ndvi: "0.70",
    ndre: "0.52",
    ndmi: "0.46",
    evi: "0.58",
    soilMoisture: "65%",
    productivity: "68 t/ha",
    alerts: [],
    position: { left: "5%", top: "80%", width: "20%", height: "15%", rotate: "0deg" },
    nextHarvest: "15/12/2024",
    daysToHarvest: 121,
    cloudCover: "8%",
    productId: "S2B_MSIL2A_20240815",
    lst: "29°C",
    rainfall: "41mm",
    ndwi: "0.30",
    pestRisk: "Low",
  },
];

const healthColor = (label: Field["healthLabel"]) => {
  if (label === "Good") return "text-emerald-500 bg-emerald-500/10";
  if (label === "Low") return "text-amber-500 bg-amber-500/10";
  return "text-red-500 bg-red-500/10";
};

type RiskLevel = "Baixo" | "Medio" | "Alto";

const parseIndex = (value: string) => {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
};

const getSmcRisk = (field: Field): RiskLevel => {
  const ndvi = parseIndex(field.ndvi);
  const ndmi = parseIndex(field.ndmi);
  const ndre = parseIndex(field.ndre);
  const ndwi = parseIndex(field.ndwi);

  const high =
    ndwi < 0.2 &&
    ndmi < 0.38 &&
    ndre < 0.46 &&
    ndvi > 0.55;

  const medium =
    (ndmi < 0.44 && ndre < 0.5) ||
    (ndwi < 0.3 && ndvi > 0.5);

  if (high) return "Alto";
  if (medium) return "Medio";
  return "Baixo";
};

const riskBadgeClass = (risk: RiskLevel) => {
  if (risk === "Alto") return "bg-red-100 text-red-700 border-red-200";
  if (risk === "Medio") return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
};

const getDiagnostic = (field: Field) => {
  const ndwi = parseFloat(field.ndwi);
  const lst = parseFloat(field.lst.replace("°C", ""));
  const rainfall = parseFloat(field.rainfall.replace("mm", ""));
  const ndvi = parseFloat(field.ndvi);
  const health = field.health;

  // Vascular Blockage (SMC) Pattern: Low NDWI (Water stress) but High NDVI (Green)
  if (ndwi < 0.2 && ndvi > 0.6) {
    return {
      diagnosis: "Bloqueio Vascular (SMC)",
      probability: "Muito Alta",
      action: "Investigar Sphenophorus e realizar corte de salvamento",
      color: "text-red-700 bg-red-100 border-red-300 ring-1 ring-red-400",
    };
  }

  if (ndwi < 0 && lst > 35 && rainfall < 10) {
    return {
      diagnosis: "Estresse Hídrico (Murcha Fisiológica)",
      probability: "Alta",
      action: "Verificar irrigação e previsão climática",
      color: "text-orange-600 bg-orange-50 border-orange-200",
    };
  }

  if (health < 0.8 && rainfall > 30 && lst < 30) {
    return {
      diagnosis: "Possível Murcha Infecciosa",
      probability: "Média",
      action: "Realizar inspeção fitossanitária em campo",
      color: "text-amber-600 bg-amber-50 border-amber-200",
    };
  }

  return {
    diagnosis: "Condições Normais",
    probability: "Baixa",
    action: "Manter monitoramento padrão",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  };
};

const getPolygonColor = (label: Field["healthLabel"]) => {
  if (label === "Good") return "bg-emerald-500/30 hover:bg-emerald-500/40 border-emerald-400/50";
  if (label === "Low") return "bg-amber-500/30 hover:bg-amber-500/40 border-amber-400/50";
  return "bg-red-500/30 hover:bg-red-500/40 border-red-400/50";
};

const layerOptions = ["NDVI", "EVI", "NDRE", "NDMI", "True Color"];

const Hotspots = () => {

  const [viewMode, setViewMode] = useState<"analytic" | "cctv">("analytic");
  const [selectedFieldId, setSelectedFieldId] = useState(fields[0].id);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [detailPanelOpen, setDetailPanelOpen] = useState(true);
  const [activeLayer, setActiveLayer] = useState(layerOptions[0]);
  const [layerMenuOpen, setLayerMenuOpen] = useState(false);
  const showPanels = !isFullscreen;
  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [isFullscreen]);

  const getPixelPosition = (percent: string, total: number) => {
    return (parseFloat(percent) / 100) * total;
  };

  const selectedField = useMemo(() => fields.find((f) => f.id === selectedFieldId) ?? fields[0], [selectedFieldId]);
  const overallHealth = useMemo(
    () => Math.round((fields.reduce((acc, f) => acc + f.health, 0) / fields.length) * 100),
    [],
  );

  const renderContent = (heightClass: string) => (
    <div className={`flex w-full overflow-hidden p-1 ${heightClass}`}>
        {/* Sidebar */}
        {showPanels && (
          <Card className="flex w-[380px] flex-col overflow-hidden rounded-[15px] border-0 bg-[#F0F0F0] shadow-none">
          {/* Sidebar Header / Tabs */}
          {/* Sidebar Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">Monitoramento</h2>
            <div className="flex gap-2">
               <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">8 Talhões</Badge>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
                {/* Overall Health */}
                <div>
                  <p className="text-sm font-medium text-slate-500">Saude geral (indices)</p>
                  <div className="mt-1 flex items-end gap-4">
                    <span className="text-6xl font-light text-slate-800">
                      {overallHealth}
                      <span className="text-4xl text-slate-400">%</span>
                    </span>
                    <div className="mb-2">
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-3 py-0.5 text-xs font-normal">
                        NDVI alto
                      </Badge>
                      <p className="mt-1 w-40 text-[10px] leading-tight text-slate-400">
                        Dados Sentinel-2 (canasat) com {currentScene.cloudCover} de nuvem.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <Scan className="h-3.5 w-3.5" />
                    Produto {currentScene.productId} • {currentScene.captureDate} • {currentScene.resolution}
                  </div>
                </div>

                {/* Fields List */}
                <div className="space-y-3">
                  {fields.map((field) => (
                    <button
                      key={field.id}
                      className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                        field.id === selectedFieldId
                          ? "border-emerald-500 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
                          : "border-transparent bg-white hover:bg-slate-50"
                      }`}
                      onClick={() => {
                        setSelectedFieldId(field.id);
                        setDetailPanelOpen(true);
                      }}
                    >
                      {(() => {
                        const risk = getSmcRisk(field);
                        return (
                          <>
                      {field.id === selectedFieldId && (
                        <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-500" />
                      )}
                      <div className="flex items-center justify-between">
                        <div className="pl-2">
                          <p className="font-semibold text-slate-900">{field.name}</p>
                          <p className="text-xs text-slate-400">{field.crop}</p>
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                            <span>{field.layer}</span>
                            <span className="text-slate-300">•</span>
                            <span>{field.lastImage}</span>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className={`rounded-full border px-2 py-[2px] text-[10px] font-semibold ${riskBadgeClass(risk)}`}>
                              Risco SMC: {risk}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {field.healthLabel !== "Good" && (
                            <Badge
                              variant="outline"
                              className="gap-1 border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-normal text-amber-600"
                            >
                              <AlertTriangle className="h-3 w-3" />
                              {field.healthLabel === "Low" ? "Atencao" : "Alerta"}
                            </Badge>
                          )}
                          <div
                            className={`flex items-center gap-1.5 text-sm font-medium ${
                              field.healthLabel === "Good"
                                ? "text-emerald-500"
                                : field.healthLabel === "Low"
                                ? "text-amber-500"
                                : "text-red-500"
                            }`}
                          >
                            <Activity className="h-4 w-4" />
                            {Math.round(field.health * 100)}%
                          </div>
                        </div>
                      </div>
                          </>
                        );
                      })()}
                    </button>
                  ))}
                </div>
              </div>

          </div>
        </Card>
        )}

        {/* Main Content */}
        <div ref={containerRef} className="relative flex-1 overflow-hidden rounded-[15px] bg-slate-900">
          {/* Background Image / Map Placeholder */}
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=3200&auto=format&fit=crop"
            alt="Satellite View"
            className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/80" />

          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />

          {/* Top Controls */}
          <div className="absolute left-6 top-6 z-20 flex flex-col gap-2">
            <div className="flex rounded-xl bg-slate-900/80 p-1 backdrop-blur-md">
              <button
                onClick={() => setViewMode("analytic")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  viewMode === "analytic" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                Analytic
              </button>
              <button
                onClick={() => setViewMode("cctv")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  viewMode === "cctv" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                CCTV
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-900/70 px-3 py-2 text-xs text-white/80 backdrop-blur">
              <Wind className="h-3.5 w-3.5" />
              Cena Sentinel-2 {currentScene.productId} • {currentScene.captureDate} • Nuvem {currentScene.cloudCover}
            </div>
          </div>

          {/* Field Overlays */}
          <div className="absolute inset-0">
            {fields.map((field) => (
              <div
                key={field.id}
                className="absolute transition-all duration-500 ease-in-out"
                style={{
                  left: field.position.left,
                  top: field.position.top,
                  width: field.position.width,
                  height: field.position.height,
                  transform: field.position.rotate ? `rotate(${field.position.rotate})` : undefined,
                }}
              >
                {/* Polygon Shape */}
                <div
                  onClick={() => {
                    setSelectedFieldId(field.id);
                    setDetailPanelOpen(true);
                  }}
                  className={`h-full w-full cursor-pointer rounded-[32px] border-2 backdrop-blur-sm transition-all ${
                    field.id === selectedFieldId
                      ? "border-white bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                      : getPolygonColor(field.healthLabel)
                  }`}
                >
                  {field.id === selectedFieldId && (
                    <div className="absolute inset-0 rounded-[30px] bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]" />
                  )}
                </div>

                {/* Label */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <div className="leading-tight">
                      <p className="text-[11px] font-semibold">{field.name}</p>
                      <p className="text-[10px] text-slate-500">{field.productivity}</p>
                    </div>
                  </div>
                </div>

                {/* Connection Line (Only for selected) */}
                {/* Removed static SVG from here, moved to global layer */}
              </div>
            ))}
          </div>

          {/* Connector Line Layer */}
          {detailPanelOpen && selectedField && containerSize.width > 0 && (
             <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible">
               <defs>
                 <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                   <feGaussianBlur stdDeviation="2" result="blur" />
                   <feComposite in="SourceGraphic" in2="blur" operator="over" />
                 </filter>
               </defs>
               {(() => {
                  const startX = getPixelPosition(selectedField.position.left, containerSize.width) + getPixelPosition(selectedField.position.width, containerSize.width);
                  const startY = getPixelPosition(selectedField.position.top, containerSize.height) + getPixelPosition(selectedField.position.height, containerSize.height) / 2;
                  
                  const endX = containerSize.width - 24 - 360; // Right-6 (24px) - Panel Width (360px)
                  const endY = 24 + 100; // Top-6 (24px) + Offset

                  const controlPoint1X = startX + 50;
                  const controlPoint1Y = startY;
                  const controlPoint2X = endX - 50;
                  const controlPoint2Y = endY;

                  return (
                    <>
                      <path
                        d={`M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`}
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        className="drop-shadow-md opacity-80"
                        filter="url(#glow)"
                      />
                      <circle cx={startX} cy={startY} r="3" fill="white" className="animate-pulse" />
                      <circle cx={endX} cy={endY} r="3" fill="white" />
                    </>
                  );
               })()}
             </svg>
          )}

          {/* Detail Panel (Floating) */}
          {detailPanelOpen && selectedField && (
            <div className="absolute right-6 top-6 z-30 w-[360px] overflow-hidden rounded-[24px] bg-white/95 shadow-[0_24px_48px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all animate-in fade-in slide-in-from-right-4">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Talhao</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">{selectedField.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      {selectedField.crop} <ArrowUpRight className="h-3 w-3" />
                    </div>
                  </div>
                  <button onClick={() => setDetailPanelOpen(false)} className="rounded-full p-1 hover:bg-slate-100">
                    <X className="h-5 w-5 text-slate-400" />
                  </button>
                </div>

                <div className="mt-6 space-y-5">
                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                    <div>
                      <p className="text-xs text-slate-400">Saude (NDVI)</p>
                      <div className="flex items-center gap-2 text-emerald-500">
                        <span className="text-lg font-semibold">{Math.round(selectedField.health * 100)}%</span>
                        <span className="h-1 w-1 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium">{selectedField.healthLabel}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Area</p>
                      <p className="text-base font-medium text-slate-900">{selectedField.area}</p>
                      <p className="text-[11px] text-slate-500">Camada ativa: {activeLayer}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl border border-slate-200 p-3 space-y-1">
                      <p className="text-xs text-slate-400">Risco SMC</p>
                      {(() => {
                        const risk = getSmcRisk(selectedField);
                        return (
                          <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${riskBadgeClass(risk)}`}>
                            {risk}
                          </span>
                        );
                      })()}
                      <p className="text-[11px] text-slate-500">
                        Baseado em NDWI/NDMI e NDRE (Sentinel-2).
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-3 space-y-1">
                      <p className="text-xs text-slate-400">Confianca</p>
                      <p className="text-sm font-semibold text-slate-900">{getDiagnostic(selectedField).probability}</p>
                      <p className="text-[11px] text-slate-500">Cruza indice + clima</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-slate-500">Ultima imagem</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedField.lastImage}</p>
                      <p className="text-slate-500 mt-1">Produto {selectedField.productId}</p>
                      <p className="text-slate-500 mt-1">Nuvem {selectedField.cloudCover}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-3 space-y-2">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>NDVI</span>
                        <span className="font-semibold text-slate-900">{selectedField.ndvi}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>NDWI</span>
                        <span className="font-semibold text-slate-900">{selectedField.ndwi}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>NDRE</span>
                        <span className="font-semibold text-slate-900">{selectedField.ndre}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>EVI</span>
                        <span className="font-semibold text-slate-900">{selectedField.evi}</span>
                      </div>
                    </div>
                  </div>

                  {/* Diagnostic Assistant */}
                  <div className={`rounded-xl border p-3 ${getDiagnostic(selectedField).color}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="h-4 w-4" />
                      <p className="text-xs font-bold uppercase tracking-wider">Assistente de Diagnóstico</p>
                    </div>
                    <p className="text-sm font-bold">{getDiagnostic(selectedField).diagnosis}</p>
                    <p className="text-xs mt-1 opacity-80">Ação sugerida: {getDiagnostic(selectedField).action}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="rounded-xl bg-slate-50 p-2 space-y-1">
                      <div className="flex items-center gap-1">
                        <Thermometer className="h-3 w-3 text-orange-500" />
                        <p className="text-slate-500 text-[10px]">LST</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{selectedField.lst}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 space-y-1">
                      <div className="flex items-center gap-1">
                        <Droplets className="h-3 w-3 text-sky-500" />
                        <p className="text-slate-500 text-[10px]">Chuva</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{selectedField.rainfall}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 space-y-1">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-emerald-500" />
                        <p className="text-slate-500 text-[10px]">Produt.</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{selectedField.productivity}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-slate-50 p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        <p className="text-slate-500 text-xs">Tendencia</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{selectedField.trend}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <Sprout className="h-4 w-4 text-emerald-500" />
                        <p className="text-slate-500 text-xs">Proxima colheita</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        {selectedField.nextHarvest} <span className="text-slate-400">• {selectedField.daysToHarvest} dias</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Alertas agronomicos</p>
                    {selectedField.alerts.length === 0 ? (
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                        Nenhum alerta para este talhao.
                      </div>
                    ) : (
                      selectedField.alerts.map((alert) => (
                        <div
                          key={alert}
                          className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700"
                        >
                          {alert}
                        </div>
                      ))

                    )}
                  </div>

                  {/* Pest Risk Indicator */}
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${selectedField.pestRisk === "High" ? "bg-red-500 animate-pulse" : selectedField.pestRisk === "Medium" ? "bg-amber-500" : "bg-emerald-500"}`} />
                      <p className="text-xs font-medium text-slate-600">Risco de Vetores (Bicudo/Broca)</p>
                    </div>
                    <span className={`text-xs font-bold ${selectedField.pestRisk === "High" ? "text-red-600" : selectedField.pestRisk === "Medium" ? "text-amber-600" : "text-emerald-600"}`}>
                      {selectedField.pestRisk === "High" ? "ALTO RISCO" : selectedField.pestRisk === "Medium" ? "MEDIO" : "BAIXO"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* Bottom Left Controls */}
          <div className="absolute bottom-8 left-8 z-20 flex gap-3">
            <button
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/50 text-white backdrop-blur-md ring-1 ring-white/10 transition hover:bg-slate-900/70"
              onClick={toggleFullscreen}
            >
              <Maximize2 className="h-5 w-5" />
            </button>
            <div className="relative">
              <button
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/50 text-white backdrop-blur-md ring-1 ring-white/10 transition hover:bg-slate-900/70"
                onClick={() => setLayerMenuOpen((prev) => !prev)}
              >
                <Layers className="h-5 w-5" />
              </button>
              {layerMenuOpen && (
                <div className="absolute bottom-14 left-0 w-40 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_30px_rgba(0,0,0,0.18)]">
                  {layerOptions.map((layer) => (
                    <button
                      key={layer}
                      className={`w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                        activeLayer === layer ? "bg-slate-900 text-white" : "bg-white text-slate-800 hover:bg-slate-50"
                      }`}
                      onClick={() => {
                        setActiveLayer(layer);
                        setLayerMenuOpen(false);
                      }}
                    >
                      {layer}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );

  return (
    <Layout title="Mapa Interativo Agricola" hideChrome={isFullscreen}>
      {isFullscreen ? (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm p-2">
          <div className="h-full w-full overflow-hidden rounded-[18px] border border-white/10 bg-slate-900/80 shadow-[0_24px_48px_rgba(0,0,0,0.35)]">
            {renderContent("h-full")}
          </div>
        </div>
      ) : (
        renderContent(showPanels ? "h-[calc(100vh-100px)] gap-3" : "h-[calc(100vh-12px)]")
      )}
    </Layout>
  );
};

export default Hotspots;
