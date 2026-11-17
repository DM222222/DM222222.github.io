import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DonutChart } from "../charts";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";

const funilData = [
  { id: "oportunidade", name: "Oportunidade", label: "100 leads", color: "var(--ramp-1)" },
  { id: "negociacao", name: "Negociação", label: "75 em negociação", color: "var(--ramp-2)" },
  { id: "proposta", name: "Proposta", label: "50 propostas", color: "var(--ramp-3)" },
  { id: "cliente", name: "Cliente", label: "25 clientes", color: "var(--ramp-4)" },
];

const segmentosData = [
  { id: "logistica", name: "Logística", value: 60, color: "var(--ramp-1)" },
  { id: "crossdocking", name: "Crossdocking", value: 20, color: "var(--ramp-2)" },
  { id: "marketplace", name: "Marketplace", value: 15, color: "var(--ramp-3)" },
  { id: "outros", name: "Outros", value: 5, color: "var(--ramp-4)" },
];

// Tooltip customizado com melhor legibilidade
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 opacity-100">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{payload[0].name}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

interface SalesDashboardResponsiveProps {
  onOpenInsights?: () => void;
}

export function SalesDashboardResponsive({ onOpenInsights }: SalesDashboardResponsiveProps) {
  return (
    <div className="h-full flex flex-col p-4 md:p-6 lg:px-10 lg:py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 lg:mb-5">
        <div>
          <h2 className="dashboard-title">Operacional - Vendas</h2>
          <p className="dashboard-subtitle text-muted-foreground">Monitoramento do funil e conversão</p>
        </div>
        <Button className="gap-2 w-full md:w-auto" onClick={onOpenInsights}>
          <Sparkles className="h-4 w-4" />
          Insights da Operação
        </Button>
      </div>

      {/* Layout Flexível para 2 Cards - Altura Responsiva */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 overflow-auto lg:overflow-hidden auto-rows-max">
        {/* Funil de Conversão - Card Flex */}
        <Card className="flex flex-col min-h-[340px] lg:min-h-[400px]">
          <CardHeader className="flex-none pb-3">
            <CardTitle className="card-title">Funil de Conversão</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="space-y-4 h-full flex flex-col justify-center py-2">
              {funilData.map((item, index) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{item.name}</span>
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                  <div 
                    className="h-12 rounded-lg transition-all shadow-sm"
                    style={{ 
                      width: `${100 - (index * 15)}%`,
                      backgroundColor: item.color,
                      marginLeft: `${index * 7}%`
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Distribuição de Clientes - Card Flex */}
        <Card className="flex flex-col min-h-[340px] lg:min-h-[400px]">
          <CardHeader className="flex-none pb-3">
            <CardTitle className="card-title">Distribuição de Clientes</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col gap-4 py-2">
              <div className="flex-1 flex items-center justify-center min-h-[180px]">
                <DonutChart data={segmentosData} />
              </div>
              
              <div className="flex-none space-y-2">
                {segmentosData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}