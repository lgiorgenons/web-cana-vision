import { useLocation, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import landscape404 from "@/assets/404-agro-real.jpg";

const NotFound = () => {
  const location = useLocation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-black cursor-none"
    >
      {/* Background Layer - Always visible but dark */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${landscape404})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Spotlight Layer - Reveals the full brightness image */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          backgroundImage: `url(${landscape404})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          maskImage: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, black 10%, transparent 80%)`,
          WebkitMaskImage: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, black 10%, transparent 80%)`,
        }}
      />

      {/* Flashlight Cursor Effect */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 mix-blend-overlay"
        style={{
          background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 80%)`
        }}
      />

      {/* Custom Cursor Ring */}
      <div
        className="fixed w-8 h-8 border-2 border-white/50 rounded-full pointer-events-none z-50 transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />

      {/* Content - Always visible but dimmed, brightens on hover/spotlight */}
      <div className="relative z-30 flex flex-col items-center text-center space-y-8 px-4">
        <div className="space-y-2 mix-blend-difference">
          <h1 className="text-[10rem] md:text-[14rem] font-black text-white/90 leading-none tracking-tighter select-none">
            404
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-wide">
            Perdido no Campo?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto">
            Use sua lanterna para encontrar o caminho de volta.
          </p>
        </div>

        <Link to="/">
          <Button
            size="lg"
            className="h-14 px-10 text-lg rounded-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(34,197,94,0.6)] z-40 cursor-pointer"
          >
            <Home className="w-5 h-5 mr-2" />
            Voltar ao Início
          </Button>
        </Link>
      </div>

      {/* Fireflies Particles */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-firefly opacity-0"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes firefly {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); opacity: 0.5; }
          90% { opacity: 1; }
          100% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); opacity: 0; }
        }
        .animate-firefly {
          animation: firefly infinite ease-in-out;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
