import { useState } from "react";
import { TorreProvider, useTorre, type Section, type UserLevel } from "./state/torre";
import { Login } from "./components/Login";
import { SplashScreen } from "./components/SplashScreen";
import { DashboardHeader } from "./components/DashboardHeader";
import { ChronusAI } from "./components/ChronusAI";
import { InsightsModal } from "./components/InsightsModal";
import { StrategicDashboard } from "./components/sections/StrategicDashboard";
import { TacticalDashboard } from "./components/sections/TacticalDashboard";
import { SalesDashboard } from "./components/sections/SalesDashboard";
import { FinanceDashboard } from "./components/sections/FinanceDashboard";
import { OperationsDashboard } from "./components/sections/OperationsDashboard";
import { AlertsDashboard } from "./components/sections/AlertsDashboard";
import { 
  BarChart3, 
  Target, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Bell,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip";
import { cn } from "./components/ui/utils";

/** Cada perfil abre na tela que importa para ele. */
const TELA_INICIAL: Record<UserLevel, Section> = {
  "c-level": "strategic",
  diretoria: "tactical",
  gerencia: "operations",
};

const NIVEIS: UserLevel[] = ["c-level", "diretoria", "gerencia"];

/** ?demo=c-level|diretoria|gerencia abre direto, sem login nem splash (uso no portfólio). */
function nivelDaUrl(): UserLevel | null {
  try {
    const q = new URLSearchParams(window.location.search);
    if (!q.has("demo")) return null;
    const v = q.get("demo") as UserLevel;
    return NIVEIS.includes(v) ? v : "c-level";
  } catch {
    return null;
  }
}

export default function App() {
  const demoUrl = nivelDaUrl();
  const [nivel, setNivel] = useState<UserLevel>(demoUrl ?? "gerencia");
  const [fase, setFase] = useState<"login" | "splash" | "app">(demoUrl ? "app" : "login");

  if (fase === "login") {
    return (
      <Login
        onLogin={(n, demo) => {
          setNivel(n);
          setFase(demo ? "app" : "splash");
        }}
      />
    );
  }
  if (fase === "splash") return <SplashScreen onFinish={() => setFase("app")} />;

  return (
    <TorreProvider key={nivel} initialSection={TELA_INICIAL[nivel]}>
      <Shell nivel={nivel} />
    </TorreProvider>
  );
}

function Shell({ nivel }: { nivel: UserLevel }) {
  const { section: currentSection, setSection: setCurrentSection, alertCount } = useTorre();
  const userLevel = nivel;
  const [sidebarOpen, setSidebarOpen] = useState(false); // fechado por padrão no celular
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [insightsModalOpen, setInsightsModalOpen] = useState(false);

  const navigationItems = [
    {
      id: "strategic" as Section,
      label: "Estratégico",
      icon: BarChart3,
      category: "Executivo",
    },
    {
      id: "tactical" as Section,
      label: "Tático",
      icon: Target,
      category: "Executivo",
    },
    {
      id: "sales" as Section,
      label: "Vendas",
      icon: ShoppingCart,
      category: "Operacional",
    },
    {
      id: "finance" as Section,
      label: "Financeiro",
      icon: DollarSign,
      category: "Operacional",
    },
    {
      id: "operations" as Section,
      label: "Operação",
      icon: Package,
      category: "Operacional",
    },
    {
      id: "alerts" as Section,
      label: "Alertas",
      icon: Bell,
      category: "Sistema",
    },
  ];

  const renderContent = () => {
    switch (currentSection) {
      case "strategic":
        return <StrategicDashboard onOpenInsights={() => setInsightsModalOpen(true)} />;
      case "tactical":
        return <TacticalDashboard onOpenInsights={() => setInsightsModalOpen(true)} />;
      case "sales":
        return <SalesDashboard onOpenInsights={() => setInsightsModalOpen(true)} />;
      case "finance":
        return <FinanceDashboard onOpenInsights={() => setInsightsModalOpen(true)} />;
      case "operations":
        return <OperationsDashboard onOpenInsights={() => setInsightsModalOpen(true)} />;
      case "alerts":
        return <AlertsDashboard />;
      default:
        return <StrategicDashboard onOpenInsights={() => setInsightsModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        userName={userLevel === "c-level" ? "CEO" : userLevel === "diretoria" ? "Diretor" : "Gerente"}
        alertCount={alertCount}
        onAlertClick={() => setCurrentSection("alerts")}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside 
          className={cn(
            "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16 border-r bg-sidebar transition-all duration-300",
            sidebarCollapsed ? "lg:w-16" : "lg:w-64"
          )}
        >
          <div className="flex items-center justify-end p-2 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          <TooltipProvider>
            <nav className="flex-1 space-y-1 p-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const button = (
                  <Button
                    key={item.id}
                    variant={currentSection === item.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      currentSection === item.id && "bg-sidebar-accent",
                      sidebarCollapsed && "justify-center px-2"
                    )}
                    onClick={() => setCurrentSection(item.id)}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Button>
                );

                if (sidebarCollapsed) {
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        {button}
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return button;
              })}
            </nav>
          </TooltipProvider>
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar border-r">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 space-y-1 p-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={currentSection === item.id ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        currentSection === item.id && "bg-sidebar-accent"
                      )}
                      onClick={() => {
                        setCurrentSection(item.id);
                        setSidebarOpen(false);
                      }}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main 
          className={cn(
            "flex-1 pt-0 pb-24 lg:pb-6 transition-all duration-300",
            sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
          )}
        >
          <div className="container max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t bg-card">
          <div className="grid grid-cols-6 gap-0.5 p-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex flex-col gap-1 h-auto py-2 px-0",
                    currentSection === item.id && "bg-accent"
                  )}
                  onClick={() => setCurrentSection(item.id)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[11px] leading-tight">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Insights Modal */}
      <InsightsModal 
        open={insightsModalOpen} 
        onOpenChange={setInsightsModalOpen}
        section={currentSection}
      />

      {/* Chronus AI Widget */}
      <ChronusAI />
    </div>
  );
}