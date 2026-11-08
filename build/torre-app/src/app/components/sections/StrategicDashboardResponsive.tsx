import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "../ui/button";
import { Sparkles, TrendingUp } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { DecisionCard } from "../DecisionCard";

const sazonalidadeData = [
  { id: "jan", mes: "Jan", valor: 2.3 },
  { id: "fev", mes: "Fev", valor: 2.1 },
  { id: "mar", mes: "Mar", valor: 2.5 },
  { id: "abr", mes: "Abr", valor: 2.4 },
  { id: "mai", mes: "Mai", valor: 2.6 },
  { id: "jun", mes: "Jun", valor: 2.8 },
];

const faturamentoData = [
  { id: "cd1", name: "CD 1", value: 30 },
  { id: "cd2", name: "CD 2", value: 20 },
  { id: "cd3", name: "CD 3", value: 15 },
  { id: "cd4", name: "CD 4", value: 10 },
  { id: "cd5", name: "CD 5", value: 5 },
];

const segmentosData = [
  { id: "logistica", name: "Logística", value: 60, color: "#2388FF" },
  { id: "crossdocking", name: "Crossdocking", value: 20, color: "#4E9FFF" },
  { id: "marketplace", name: "Marketplace", value: 15, color: "#8DC1FF" },
  { id: "outros", name: "Outros", value: 5, color: "#C3DDFF" },
];

const fluxoCaixaData = [
  { id: "jan", mes: "Jan", pagar: 120, receber: 180 },
  { id: "fev", mes: "Fev", pagar: 135, receber: 165 },
  { id: "mar", mes: "Mar", pagar: 140, receber: 190 },
  { id: "abr", mes: "Abr", pagar: 130, receber: 200 },
  { id: "mai", mes: "Mai", pagar: 125, receber: 195 },
  { id: "jun", mes: "Jun", pagar: 145, receber: 210 },
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
            <p className="card-subtitle text-muted-foreground">Faturamento Global e por CD</p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-1 overflow-hidden pt-2">
            <div className="flex-none bg-[#f8faff] dark:bg-gray-800 p-1.5 rounded-lg">
              <div className="text-xs text-muted-foreground">Global</div>
              <div className="text-3xl font-bold text-[color:var(--data-text)] leading-tight">R$80M</div>
            </div>
            
            <div className="flex-1 space-y-1 flex flex-col justify-center">
              {faturamentoData.map((item) => (
                <div key={item.name} className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <span className="text-sm font-medium text-[#090924] dark:text-gray-100">{item.name}</span>
                  <span className="text-sm font-bold text-[color:var(--data-text)]">R$ {item.value}M</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sazonalidade - Card M (8 cols) */}
        <Card className="md:col-span-1 lg:col-span-8 flex flex-col min-h-[300px] lg:h-full">
          <CardHeader className="flex-none pb-2">
            <div className="flex flex-col gap-2">
              <CardTitle className="card-title">Sazonalidade de Faturamento</CardTitle>
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sazonalidadeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E1E4ED" className="dark:stroke-gray-700" />
                <XAxis dataKey="mes" stroke="#6d758f" className="dark:stroke-gray-400" tick={{ fontSize: 11 }} />
                <YAxis 
                  stroke="#6d758f"
                  className="dark:stroke-gray-400"
                  ticks={[0, 1, 2, 3]}
                  tickFormatter={(value) => `${value}M`}
                  domain={[0, 3]}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="valor" fill="#2388FF" radius={[8, 8, 0, 0]} name="Faturamento (M)" id="bar-faturamento" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Row 2: Score Médio + Fluxo de Caixa */}
        {/* Score Médio - Card P (4 cols) */}
        <Card className="md:col-span-1 lg:col-span-4 flex flex-col min-h-[300px] lg:h-full">
          <CardHeader className="flex-none pb-2">
            <CardTitle className="card-title">Score Médio</CardTitle>
            <p className="card-subtitle text-muted-foreground">por categoria de clientes</p>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="flex flex-col items-center gap-3 h-full justify-center">
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle key="base" cx="56" cy="56" r="48" stroke="#f1f3f7" className="dark:stroke-gray-700" strokeWidth="11" fill="none" />
                    <circle key="logistica" cx="56" cy="56" r="48" stroke="#2388FF" strokeWidth="11" fill="none"
                      strokeDasharray={`${2 * Math.PI * 48 * 0.60} ${2 * Math.PI * 48}`} strokeLinecap="round" />
                    <circle key="crossdocking" cx="56" cy="56" r="48" stroke="#4E9FFF" strokeWidth="11" fill="none"
                      strokeDasharray={`${2 * Math.PI * 48 * 0.20} ${2 * Math.PI * 48}`}
                      strokeDashoffset={`-${2 * Math.PI * 48 * 0.60}`} strokeLinecap="round" />
                    <circle key="marketplace" cx="56" cy="56" r="48" stroke="#8DC1FF" strokeWidth="11" fill="none"
                      strokeDasharray={`${2 * Math.PI * 48 * 0.15} ${2 * Math.PI * 48}`}
                      strokeDashoffset={`-${2 * Math.PI * 48 * 0.80}`} strokeLinecap="round" />
                    <circle key="outros" cx="56" cy="56" r="48" stroke="#C3DDFF" strokeWidth="11" fill="none"
                      strokeDasharray={`${2 * Math.PI * 48 * 0.05} ${2 * Math.PI * 48}`}
                      strokeDashoffset={`-${2 * Math.PI * 48 * 0.95}`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">90</span>
                    <span className="text-xs text-muted-foreground">clientes ativos</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full space-y-1.5">
                {segmentosData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs">{item.name}</span>
                    </div>
                    <span className="text-xs font-semibold">{item.value}%</span>
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
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fluxoCaixaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E1E4ED" className="dark:stroke-gray-700" />
                <XAxis dataKey="mes" stroke="#6d758f" className="dark:stroke-gray-400" tick={{ fontSize: 11 }} />
                <YAxis stroke="#6d758f" className="dark:stroke-gray-400" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(v: string) => <span style={{ color: 'var(--foreground)' }}>{v}</span>} />
                <Line 
                  type="monotone" 
                  dataKey="pagar" 
                  stroke="#2388FF" 
                  strokeWidth={3} 
                  name="A pagar" 
                  dot={{ fill: "#2388FF", r: 4 }}
                  id="line-pagar"
                />
                <Line 
                  type="monotone" 
                  dataKey="receber" 
                  stroke="var(--series-2)" 
                  strokeDasharray="6 4"
                  strokeWidth={3} 
                  name="Receber" 
                  dot={{ fill: "var(--series-2)", r: 4 }}
                  id="line-receber"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}