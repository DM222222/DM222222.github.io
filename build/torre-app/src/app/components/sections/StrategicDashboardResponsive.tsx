import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarSeriesChart, LineSeriesChart, fmtMi } from "../charts";
import { Button } from "../ui/button";
import { Sparkles, TrendingUp } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { DecisionCard } from "../DecisionCard";

// R$ milhões por mês (ritmo coerente com R$ 80 mi no ano)
const sazonalidadeData = [
  { id: "jan", mes: "Jan", valor: 6.1 },
  { id: "fev", mes: "Fev", valor: 5.8 },
  { id: "mar", mes: "Mar", valor: 6.6 },
  { id: "abr", mes: "Abr", valor: 6.4 },
  { id: "mai", mes: "Mai", valor: 6.9 },
  { id: "jun", mes: "Jun", valor: 7.3 },
];

const faturamentoData = [
  { id: "cd1", name: "CD 1", value: 30 },
  { id: "cd2", name: "CD 2", value: 20 },
  { id: "cd3", name: "CD 3", value: 15 },
  { id: "cd4", name: "CD 4", value: 10 },
  { id: "cd5", name: "CD 5", value: 5 },
];

const scoreData = [
  { id: "logistica", name: "Logística", score: "8,1", color: "var(--ramp-1)" },
  { id: "crossdocking", name: "Crossdocking", score: "7,4", color: "var(--ramp-2)" },
  { id: "marketplace", name: "Marketplace", score: "6,9", color: "var(--ramp-3)" },
  { id: "outros", name: "Outros", score: "6,2", color: "var(--ramp-4)" },
];

const segmentosData = [
  { id: "logistica", name: "Logística", value: 60, color: "var(--ramp-1)" },
  { id: "crossdocking", name: "Crossdocking", value: 20, color: "var(--ramp-2)" },
  { id: "marketplace", name: "Marketplace", value: 15, color: "var(--ramp-3)" },
  { id: "outros", name: "Outros", value: 5, color: "var(--ramp-4)" },
];

// R$ milhões por mês. A receber acompanha o faturamento (Sazonalidade); a pagar inclui o custo operacional.
const fluxoCaixaData = [
  { id: "jan", mes: "Jan", pagar: 4.9, receber: 5.9 },
  { id: "fev", mes: "Fev", pagar: 5.2, receber: 5.7 },
  { id: "mar", mes: "Mar", pagar: 5.4, receber: 6.4 },
  { id: "abr", mes: "Abr", pagar: 5.1, receber: 6.3 },
  { id: "mai", mes: "Mai", pagar: 5.3, receber: 6.7 },
  { id: "jun", mes: "Jun", pagar: 5.6, receber: 7.1 },
];

// Tooltip customizado
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

interface StrategicDashboardResponsiveProps {
  onOpenInsights?: () => void;
}

export function StrategicDashboardResponsive({ onOpenInsights }: StrategicDashboardResponsiveProps) {
  return (
    <div className="h-full flex flex-col p-4 md:p-6 lg:px-10 lg:py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 lg:mb-5">
        <div>
          <h2 className="dashboard-title">Nível Estratégico</h2>
          <p className="dashboard-subtitle text-muted-foreground">Visão executiva para C-Level</p>
        </div>
        <Button className="gap-2 w-full md:w-auto" onClick={onOpenInsights}>
          <Sparkles className="h-4 w-4" />
          Insights da Operação
        </Button>
      </div>

      <div className="mb-4 lg:mb-6">
        <DecisionCard />
      </div>

      {/* Evidência: gráficos de apoio à decisão */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6 auto-rows-max lg:auto-rows-[minmax(320px,auto)]">
        
        {/* Row 1: Faturamento + Sazonalidade */}
        {/* Faturamento Global - Card P (4 cols) */}
        <Card className="md:col-span-1 lg:col-span-4 flex flex-col min-h-[300px] lg:h-full">
          <CardHeader className="flex-none pb-1">
            <CardTitle className="card-title">Faturamento</CardTitle>
            <p className="card-subtitle text-muted-foreground">Últimos 12 meses, global e por CD</p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-1 overflow-hidden pt-2">
            <div className="flex-none bg-[#f8faff] dark:bg-gray-800 p-1.5 rounded-lg">
              <div className="text-xs text-muted-foreground">Global</div>
              <div className="text-3xl font-bold text-[color:var(--data-text)] leading-tight">R$ 80 mi</div>
            </div>
            
            <div className="flex-1 space-y-1 flex flex-col justify-center">
              {faturamentoData.map((item) => (
                <div key={item.name} className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <span className="text-sm font-medium text-[#090924] dark:text-gray-100">{item.name}</span>
                  <span className="text-sm font-bold text-[color:var(--data-text)]">R$ {item.value} mi</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sazonalidade - Card M (8 cols) */}
        <Card className="md:col-span-1 lg:col-span-8 flex flex-col min-h-[300px] lg:h-full">
          <CardHeader className="flex-none pb-2">
            <div className="flex flex-col gap-2">
              <div>
                <CardTitle className="card-title">Sazonalidade de Faturamento</CardTitle>
                <p className="card-subtitle text-muted-foreground">Faturamento mensal, em R$ milhões</p>
              </div>
              <Tabs defaultValue="mes" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="semana" className="text-xs">Semana</TabsTrigger>
                  <TabsTrigger value="mes" className="text-xs">Mês</TabsTrigger>
                  <TabsTrigger value="ano" className="text-xs">Ano</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-2 overflow-hidden">
            <BarSeriesChart data={sazonalidadeData} xKey="mes" series={[{ key: "valor", name: "Faturamento", color: "var(--ramp-1)" }]} legend={false} yMax={8} yTicks={2} yFormat={fmtMi} />
          </CardContent>
        </Card>

        {/* Row 2: Score Médio + Fluxo de Caixa */}
        {/* Score Médio - Card P (4 cols) */}
        <Card className="md:col-span-1 lg:col-span-4 flex flex-col min-h-[300px] lg:h-full">
          <CardHeader className="flex-none pb-2">
            <CardTitle className="card-title">Score Médio</CardTitle>
            <p className="card-subtitle text-muted-foreground">Satisfação de 0 a 10, por categoria de clientes</p>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="flex flex-col items-center gap-3 h-full justify-center">
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="48" stroke="#f1f3f7" className="dark:stroke-gray-700" strokeWidth="11" fill="none" />
                    <circle cx="56" cy="56" r="48" stroke="var(--ramp-1)" strokeWidth="11" fill="none"
                      strokeDasharray={`${2 * Math.PI * 48 * 0.76} ${2 * Math.PI * 48}`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">7,6</span>
                    <span className="text-xs text-muted-foreground">de 10</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full space-y-1.5">
                {scoreData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs">{item.name}</span>
                    </div>
                    <span className="text-xs font-semibold">{item.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fluxo de Caixa - Card M (8 cols) */}
        <Card className="md:col-span-1 lg:col-span-8 flex flex-col min-h-[300px] lg:h-full">
          <CardHeader className="flex-none pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <CardTitle className="card-title">Fluxo de Caixa</CardTitle>
                <p className="card-subtitle text-muted-foreground">Contas a pagar e a receber, em R$ milhões</p>
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
            <LineSeriesChart data={fluxoCaixaData} xKey="mes" series={[{ key: "receber", name: "A receber", color: "var(--ramp-1)" }, { key: "pagar", name: "A pagar", color: "var(--fill-warn)", dashed: true }]} yFormat={fmtMi} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}