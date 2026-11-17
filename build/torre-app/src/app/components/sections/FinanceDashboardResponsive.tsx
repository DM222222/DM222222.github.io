import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarSeriesChart, DonutChart, LineSeriesChart } from "../charts";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const fluxoCaixaData = [
  { id: "jan", mes: "Jan", pagar: 120, receber: 180 },
  { id: "fev", mes: "Fev", pagar: 135, receber: 165 },
  { id: "mar", mes: "Mar", pagar: 140, receber: 190 },
  { id: "abr", mes: "Abr", pagar: 130, receber: 200 },
  { id: "mai", mes: "Mai", pagar: 125, receber: 195 },
  { id: "jun", mes: "Jun", pagar: 145, receber: 210 },
];

const segmentosData = [
  { id: "logistica", name: "Logística", value: 60, color: "var(--ramp-1)" },
  { id: "crossdocking", name: "Crossdocking", value: 20, color: "var(--ramp-2)" },
  { id: "marketplace", name: "Marketplace", value: 15, color: "var(--ramp-3)" },
  { id: "outros", name: "Outros", value: 5, color: "var(--ramp-4)" },
];

const inadimplenciaData = [
  { id: "jan", mes: "Jan", logistica: 5, crossdocking: 3, marketplace: 2, outros: 1 },
  { id: "fev", mes: "Fev", logistica: 7, crossdocking: 4, marketplace: 3, outros: 2 },
  { id: "mar", mes: "Mar", logistica: 6, crossdocking: 3, marketplace: 2, outros: 1 },
  { id: "abr", mes: "Abr", logistica: 8, crossdocking: 5, marketplace: 3, outros: 2 },
  { id: "mai", mes: "Mai", logistica: 9, crossdocking: 6, marketplace: 4, outros: 2 },
  { id: "jun", mes: "Jun", logistica: 7, crossdocking: 4, marketplace: 3, outros: 1 },
];

const custoOperacionalData = [
  { id: "cd1", cd: "CD 1", valor: 800 },
  { id: "cd2", cd: "CD 2", valor: 400 },
  { id: "cd3", cd: "CD 3", valor: 300 },
  { id: "cd4", cd: "CD 4", valor: 200 },
  { id: "cd5", cd: "CD 5", valor: 100 },
];

// Tooltip customizado com melhor legibilidade
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 opacity-100">
        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
            <span style={{ color: entry.color }}>{entry.name}: </span>
            <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface FinanceDashboardResponsiveProps {
  onOpenInsights?: () => void;
}

export function FinanceDashboardResponsive({ onOpenInsights }: FinanceDashboardResponsiveProps) {
  return (
    <div className="h-full flex flex-col p-4 md:p-6 lg:px-10 lg:py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 lg:mb-5">
        <div>
          <h2 className="dashboard-title">Operacional - Financeiro</h2>
          <p className="dashboard-subtitle text-muted-foreground">Gestão financeira e custos</p>
        </div>
        <Button className="gap-2 w-full md:w-auto" onClick={onOpenInsights}>
          <Sparkles className="h-4 w-4" />
          Insights da Operação
        </Button>
      </div>

      {/* CSS Grid Layout - ALTURA FIXA 320px em Desktop */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6 auto-rows-max lg:auto-rows-[minmax(320px,auto)]">
        
        {/* Row 1: Fluxo de Caixa + Percentual de Faturamento */}
        {/* Fluxo de Caixa - Card M (8 cols) */}
        <Card className="md:col-span-1 lg:col-span-8 flex flex-col min-h-[300px] lg:h-full">
          <CardHeader className="flex-none pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <CardTitle className="card-title">Fluxo de Caixa</CardTitle>
                <p className="card-subtitle text-muted-foreground">Contas a pagar e receber</p>
              </div>
              <Tabs defaultValue="mes">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="quinzena" className="text-xs">Quinz.</TabsTrigger>
                  <TabsTrigger value="mes" className="text-xs">Mês</TabsTrigger>
                  <TabsTrigger value="semestre" className="text-xs">Sem.</TabsTrigger>
                  <TabsTrigger value="ano" className="text-xs">Ano</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-2 overflow-hidden">
            <LineSeriesChart data={fluxoCaixaData} xKey="mes" series={[{ key: "pagar", name: "A pagar", color: "var(--ramp-1)" }, { key: "receber", name: "Receber", color: "var(--series-2)", dashed: true }]} />
          </CardContent>
        </Card>

        {/* Percentual de Faturamento por Segmento - Card P (4 cols) */}
        <Card className="md:col-span-1 lg:col-span-4 flex flex-col min-h-[300px] lg:h-full">
          <CardHeader className="flex-none pb-1">
            <CardTitle className="card-title text-sm">Percentual de Faturamento por Segmento</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden pt-2">
            <div className="h-full flex flex-col gap-2">
              <div className="flex-1 flex items-center justify-center min-h-[120px]">
                <DonutChart data={segmentosData} />
              </div>
              
              <div className="flex-none space-y-1">
                {segmentosData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div 
                        className="w-2 h-2 rounded-full flex-shrink-0" 
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

        {/* Row 2: Inadimplência + Custo Operacional */}
        {/* Inadimplência Global - Card M (8 cols) */}
        <Card className="md:col-span-1 lg:col-span-8 flex flex-col min-h-[300px] lg:h-full">
          <CardHeader className="flex-none pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <CardTitle className="card-title">Inadimplência Global</CardTitle>
              <Tabs defaultValue="mes">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="semana" className="text-xs">Semana</TabsTrigger>
                  <TabsTrigger value="mes" className="text-xs">Mês</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-2 overflow-hidden">
            <BarSeriesChart data={inadimplenciaData} xKey="mes" series={[{ key: "logistica", name: "Logística", color: "var(--ramp-1)" }, { key: "crossdocking", name: "Crossdocking", color: "var(--ramp-3)" }, { key: "marketplace", name: "Marketplace", color: "var(--ramp-2)" }, { key: "outros", name: "Outros", color: "var(--ramp-4)" }]} stacked />
          </CardContent>
        </Card>

        {/* Custo Operacional - Card P (4 cols) */}
        <Card className="md:col-span-1 lg:col-span-4 flex flex-col min-h-[300px] lg:h-full">
          <CardHeader className="flex-none pb-1">
            <CardTitle className="card-title text-sm">Custo Operacional Global e por CD</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden pt-2">
            <div className="h-full flex flex-col justify-center space-y-2">
              <div className="flex-none bg-[#f8faff] dark:bg-gray-800 p-2 rounded-lg">
                <div className="text-xs text-muted-foreground mb-0.5">Global</div>
                <div className="text-3xl font-bold text-[color:var(--data-text)]">R$ 1.8M</div>
              </div>
              
              <div className="flex-1 space-y-1.5 overflow-auto">
                {custoOperacionalData.map((item) => (
                  <div key={item.cd} className="flex items-center justify-between pb-1 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <span className="text-xs font-medium text-muted-foreground">{item.cd}</span>
                    <span className="text-xs font-bold text-[#090924] dark:text-gray-100">R$ {item.valor}K</span>
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