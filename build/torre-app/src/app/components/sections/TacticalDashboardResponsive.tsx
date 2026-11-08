import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";
import { DecisionCard } from "../DecisionCard";

const timeToCashData = [
  { id: "15d", periodo: "15 dias", clientes: 5, color: "#2388FF" },
  { id: "30d", periodo: "30 dias", clientes: 10, color: "#4E9FFF" },
  { id: "60d", periodo: "60 dias", clientes: 30, color: "#8DC1FF" },
  { id: "90d", periodo: "90 dias", clientes: 45, color: "#C3DDFF" },
];

const previsaoRecebimentoData = [
  { id: "jan", mes: "JAN", cd1: 15, cd2: 10, cd3: 8, cd4: 5, cd5: 7 },
  { id: "fev", mes: "FEV", cd1: 18, cd2: 12, cd3: 10, cd4: 7, cd5: 9 },
  { id: "mar", mes: "MAR", cd1: 16, cd2: 14, cd3: 9, cd4: 6, cd5: 8 },
  { id: "abr", mes: "ABR", cd1: 20, cd2: 15, cd3: 11, cd4: 8, cd5: 10 },
  { id: "mai", mes: "MAI", cd1: 22, cd2: 17, cd3: 12, cd4: 9, cd5: 11 },
  { id: "jun", mes: "JUN", cd1: 24, cd2: 19, cd3: 13, cd4: 10, cd5: 12 },
  { id: "jul", mes: "JUL", cd1: 28, cd2: 23, cd3: 15, cd4: 12, cd5: 14 },
];

const faturamentoClienteData = [
  { id: "jan", mes: "Jan", previsto: 1.2, realizado: 1.0 },
  { id: "fev", mes: "Fev", previsto: 1.3, realizado: 1.1 },
  { id: "mar", mes: "Mar", previsto: 1.4, realizado: 1.2 },
  { id: "abr", mes: "Abr", previsto: 1.5, realizado: 1.3 },
  { id: "mai", mes: "Mai", previsto: 1.6, realizado: 1.4 },
  { id: "jun", mes: "Jun", previsto: 1.5, realizado: 1.7 },
  { id: "jul", mes: "Jul", previsto: 1.7, realizado: 1.6 },
  { id: "ago", mes: "Ago", previsto: 1.6, realizado: 1.5 },
  { id: "set", mes: "Set", previsto: 1.8, realizado: 1.4 },
  { id: "out", mes: "Out", previsto: 1.7, realizado: 1.5 },
  { id: "nov", mes: "Nov", previsto: 1.9, realizado: 1.7 },
  { id: "dez", mes: "Dez", previsto: 1.8, realizado: 1.8 },
];

// Cores em escala de azul para cada CD
const cdColors: { [key: string]: string } = {
  "CD 3": "#0D417D",
  "CD 4": "#2388FF",
  "CD 5": "#4E9FFF",
  "CD 1": "#8DC1FF",
  "CD 2": "#C3DDFF",
};

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

interface TacticalDashboardResponsiveProps {
  onOpenInsights?: () => void;
}

export function TacticalDashboardResponsive({ onOpenInsights }: TacticalDashboardResponsiveProps) {
  const [selectedCD, setSelectedCD] = useState("cd1");

  return (
    <div className="h-full flex flex-col p-4 md:p-6 lg:px-10 lg:py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 lg:mb-5">
        <div>
          <h2 className="dashboard-title">Nível Tático</h2>
          <p className="dashboard-subtitle text-muted-foreground">Monitoramento gerencial e operacional</p>
        </div>
        <Button className="gap-2 w-full md:w-auto" onClick={onOpenInsights}>
          <Sparkles className="h-4 w-4" />
          Insights da Operação
        </Button>
      </div>

      <div className="mb-4 lg:mb-6">
        <DecisionCard compact />
      </div>

      {/* CSS Grid Layout - ALTURA FIXA 320px em Desktop */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6 auto-rows-max lg:auto-rows-[minmax(320px,auto)]">
        
        {/* Row 1: Time-to-Cash + Previsão de Recebimento */}
        {/* Time-to-Cash - Card P (4 cols) */}
        <Card className="md:col-span-1 lg:col-span-4 flex flex-col min-h-[300px] lg:h-full">
          <CardHeader className="flex-none pb-2">
            <CardTitle className="card-title">Time-to-Cash</CardTitle>
            <p className="card-subtitle text-muted-foreground">Quantidade de clientes com recebimento previsto</p>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden py-2">
            <div className="flex flex-col items-center gap-2 h-full justify-center">
              <div className="flex items-center justify-center">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full transform -rotate-90">
                    {timeToCashData.map((item, index) => {
                      const total = timeToCashData.reduce((sum, d) => sum + d.clientes, 0);
                      const percentage = item.clientes / total;
                      const previousPercentage = timeToCashData
                        .slice(0, index)
                        .reduce((sum, d) => sum + d.clientes / total, 0);
                      
                      const radius = 42;
                      const circumference = 2 * Math.PI * radius;
                      const offset = circumference * previousPercentage;
                      const dashArray = circumference * percentage;

                      return (
                        <circle
                          key={item.periodo}
                          cx="56"
                          cy="56"
                          r={radius}
                          stroke={item.color}
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={`${dashArray} ${circumference}`}
                          strokeDashoffset={-offset}
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">90</span>
                    <span className="text-xs text-muted-foreground">clientes ativos</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full space-y-1">
                {timeToCashData.map((item) => (
                  <div key={item.periodo} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs">{item.periodo}</span>
                    </div>
                    <span className="text-xs font-semibold">{item.clientes} clientes</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Previsão de Recebimento - Card M (8 cols) */}
        <Card className="md:col-span-1 lg:col-span-8 flex flex-col min-h-[300px] lg:h-full">
          <CardHeader className="flex-none pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <CardTitle className="card-title">Previsão de Recebimento (HUB)</CardTitle>
                <p className="card-subtitle text-muted-foreground">Volumes</p>
              </div>
              <Tabs defaultValue="mes">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="semana" className="text-xs">Semana</TabsTrigger>
                  <TabsTrigger value="mes" className="text-xs">Mês</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-2 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={previsaoRecebimentoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E1E4ED" className="dark:stroke-gray-700" />
                <XAxis dataKey="mes" stroke="#6d758f" className="dark:stroke-gray-400" tick={{ fontSize: 11 }} />
                <YAxis stroke="#6d758f" className="dark:stroke-gray-400" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(v: string) => <span style={{ color: 'var(--foreground)' }}>{v}</span>} />
                <Line type="monotone" dataKey="cd1" stroke="#0D417D" strokeWidth={2} name="CD 1" dot={{ r: 3 }} id="line-cd1" />
                <Line type="monotone" dataKey="cd2" stroke="#2388FF" strokeWidth={2} name="CD 2" dot={{ r: 3 }} id="line-cd2" />
                <Line type="monotone" dataKey="cd3" stroke="#4E9FFF" strokeWidth={2} name="CD 3" dot={{ r: 3 }} id="line-cd3" />
                <Line type="monotone" dataKey="cd4" stroke="#8DC1FF" strokeWidth={2} name="CD 4" dot={{ r: 3 }} id="line-cd4" />
                <Line type="monotone" dataKey="cd5" stroke="#C3DDFF" strokeWidth={2} name="CD 5" dot={{ r: 3 }} id="line-cd5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Row 2: Divergência + Performance de Faturamento */}
        {/* Divergência - Card P (4 cols) */}
        <Card className="md:col-span-1 lg:col-span-4 flex flex-col min-h-[280px] lg:h-full">
          <CardHeader className="flex-none pb-2">
            <div className="flex flex-col gap-2">
              <CardTitle className="card-title">Divergência</CardTitle>
              <p className="card-subtitle text-muted-foreground">Ocupação Prevista X Realizada</p>
              <Select value={selectedCD} onValueChange={setSelectedCD}>
                <SelectTrigger className="w-full text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cd1">CD 1</SelectItem>
                  <SelectItem value="cd2">CD 2</SelectItem>
                  <SelectItem value="cd3">CD 3</SelectItem>
                  <SelectItem value="cd4">CD 4</SelectItem>
                  <SelectItem value="cd5">CD 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center overflow-hidden">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="52" stroke="#f1f3f7" className="dark:stroke-gray-700" strokeWidth="10" fill="none" />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="#2388FF"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 52 * 0.18} ${2 * Math.PI * 52}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[color:var(--data-text)]">18%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance de Faturamento - Card M (8 cols) */}
        <Card className="md:col-span-1 lg:col-span-8 flex flex-col min-h-[300px] lg:h-full">
          <CardHeader className="flex-none pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <CardTitle className="card-title">Performance de Faturamento por Cliente</CardTitle>
              <Tabs defaultValue="mes">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="semana" className="text-xs">Semana</TabsTrigger>
                  <TabsTrigger value="mes" className="text-xs">Mês</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pt-2 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={faturamentoClienteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E1E4ED" className="dark:stroke-gray-700" />
                <XAxis dataKey="mes" stroke="#6d758f" className="dark:stroke-gray-400" tick={{ fontSize: 11 }} />
                <YAxis stroke="#6d758f" className="dark:stroke-gray-400" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(v: string) => <span style={{ color: 'var(--foreground)' }}>{v}</span>} />
                <Bar dataKey="previsto" fill="#8DC1FF" name="Previsto" radius={[8, 8, 0, 0]} id="bar-previsto" />
                <Bar dataKey="realizado" fill="#2388FF" name="Realizado" radius={[8, 8, 0, 0]} id="bar-realizado" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}