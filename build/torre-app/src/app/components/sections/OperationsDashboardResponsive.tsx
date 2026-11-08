import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";
import { useTorre } from "../../state/torre";
import { DecisionCard } from "../DecisionCard";
import { ESTADO_INFO, estadoOcupacao, estadoSla, type Estado } from "../status";

const prontosData = [
  { id: "15d", periodo: "15 dias", prontos: 145, pendente: 32, naoProntos: 24 },
  { id: "30d", periodo: "30 dias", prontos: 98, pendente: 28, naoProntos: 57 },
  { id: "60d", periodo: "60 dias", prontos: 112, pendente: 45, naoProntos: 44 },
  { id: "90d", periodo: "90 dias", prontos: 87, pendente: 38, naoProntos: 57 },
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

// Medidor: cor + ícone + rótulo (estado nunca só por cor)
function GaugeChart({ percentage, label, estado }: { percentage: number; label: string; estado: Estado }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * percentage) / 100;
  const { cor, label: rotulo, Icon } = ESTADO_INFO[estado];

  return (
    <div className="flex flex-col items-center gap-1" role="img" aria-label={`${label}: ${percentage}%, ${rotulo}`}>
      <div className="relative w-20 h-20">
        <svg className="w-full h-full transform -rotate-90" aria-hidden>
          <circle cx="40" cy="40" r={radius} stroke="#F1F3F7" className="dark:stroke-gray-700" strokeWidth="8" fill="none" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={cor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset .6s ease, stroke .3s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-semibold tabular-nums">{percentage}%</span>
        </div>
      </div>
      <p className="text-xs font-medium text-center">{label}</p>
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: cor }}>
        <Icon className="h-3 w-3" aria-hidden />
        {rotulo}
      </span>
    </div>
  );
}

interface OperationsDashboardResponsiveProps {
  onOpenInsights?: () => void;
}

export function OperationsDashboardResponsive({ onOpenInsights }: OperationsDashboardResponsiveProps) {
  const { cds } = useTorre();
  const [selectedCD, setSelectedCD] = useState("cd1");
  const [selectedTurno, setSelectedTurno] = useState("turno1");
  const [selectedTFACD, setSelectedTFACD] = useState("cd1");

  // Mapeamento de CDs
  const cdOptions = [
    { value: "cd1", label: "CD 1" },
    { value: "cd2", label: "CD 2" },
    { value: "cd3", label: "CD 3" },
    { value: "cd4", label: "CD 4" },
    { value: "cd5", label: "CD 5" },
  ];

  const getCDLabel = (value: string) => {
    return cdOptions.find(option => option.value === value)?.label || "";
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 lg:px-10 lg:py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 lg:mb-5">
        <div>
          <h2 className="dashboard-title">Operacional - Operação</h2>
          <p className="dashboard-subtitle text-muted-foreground">Performance operacional e SLA</p>
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
        
        {/* Row 1: Taxa Ocupação + CMC + SLA */}
        {/* Taxa de Ocupação - Card P (4 cols) */}
        <Card className="md:col-span-1 lg:col-span-4 flex flex-col min-h-[280px] lg:h-full">
          <CardHeader className="flex-none pb-1">
            <div>
              <CardTitle className="card-title">Taxa de Ocupação</CardTitle>
              <p className="card-subtitle text-muted-foreground">Por CD</p>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden pt-2">
            <div className="grid grid-cols-3 gap-2 h-full content-center">
              {cds.map((item) => (
                <GaugeChart
                  key={item.id}
                  percentage={item.ocupacao}
                  label={item.nome}
                  estado={estadoOcupacao(item.ocupacao)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CMC - Card P (4 cols) */}
        <Card className="md:col-span-1 lg:col-span-4 flex flex-col min-h-[280px] lg:h-full">
          <CardHeader className="flex-none pb-1">
            <div className="flex flex-col gap-2">
              <div>
                <CardTitle className="card-title">CMC</CardTitle>
                <p className="card-subtitle text-muted-foreground">Capacidade de Movimentação de Carga - Por CD</p>
              </div>
              <div className="flex gap-2">
                <Select value={selectedCD} onValueChange={setSelectedCD}>
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue placeholder="CD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cd1">CD 1</SelectItem>
                    <SelectItem value="cd2">CD 2</SelectItem>
                    <SelectItem value="cd3">CD 3</SelectItem>
                    <SelectItem value="cd4">CD 4</SelectItem>
                    <SelectItem value="cd5">CD 5</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedTurno} onValueChange={setSelectedTurno}>
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue placeholder="Turno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="turno1">Turno 1</SelectItem>
                    <SelectItem value="turno2">Turno 2</SelectItem>
                    <SelectItem value="turno3">Turno 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center overflow-hidden pt-2">
            <div className="text-6xl font-bold text-[color:var(--data-text)]">25</div>
            <p className="text-sm text-muted-foreground mt-2">Volumes/HH</p>
          </CardContent>
        </Card>

        {/* SLA por CD - Card P (4 cols) */}
        <Card className="md:col-span-1 lg:col-span-4 flex flex-col min-h-[280px] lg:h-full">
          <CardHeader className="flex-none pb-1">
            <div>
              <CardTitle className="card-title">SLA</CardTitle>
              <p className="card-subtitle text-muted-foreground">Por CD</p>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden pt-2">
            <div className="grid grid-cols-3 gap-2 h-full content-center">
              {cds.map((item) => (
                <GaugeChart
                  key={item.id}
                  percentage={item.sla}
                  label={item.nome}
                  estado={estadoSla(item.sla)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Row 2: TFA + Prontos para Operar */}
        {/* TFA - Card P (4 cols) */}
        <Card className="md:col-span-1 lg:col-span-4 flex flex-col min-h-[280px] lg:h-full">
          <CardHeader className="flex-none pb-1">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <CardTitle className="card-title">TFA</CardTitle>
                  <p className="card-subtitle text-muted-foreground">Termo de Faltas e Avarias - Por CD</p>
                </div>
                <Select value={selectedTFACD} onValueChange={setSelectedTFACD}>
                  <SelectTrigger className="w-24 text-xs">
                    <SelectValue placeholder="CD" />
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
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center gap-2 overflow-hidden pt-2">
            <p className="text-sm font-semibold text-center">{getCDLabel(selectedTFACD)}</p>
            <div className="bg-[#f8faff] dark:bg-gray-800 rounded-3xl h-20 w-full flex items-center justify-center">
              <div className="text-5xl font-semibold text-[color:var(--st-ok)]">1%</div>
            </div>
          </CardContent>
        </Card>

        {/* Prontos para Operar - Card M (8 cols) */}
        <Card className="md:col-span-1 lg:col-span-8 flex flex-col min-h-[280px] lg:h-full">
          <CardHeader className="flex-none pb-2">
            <CardTitle className="card-title">Prontos para Operar</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pt-2 flex flex-col gap-2 overflow-hidden">
            <div className="flex-1 min-h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prontosData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E1E4ED" className="dark:stroke-gray-700" />
                  <XAxis dataKey="periodo" stroke="#6d758f" className="dark:stroke-gray-400" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#6d758f" className="dark:stroke-gray-400" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="prontos" stackId="a" fill="var(--fill-ok)" name="Prontos" radius={[0, 0, 0, 0]} id="bar-prontos" />
                  <Bar dataKey="pendente" stackId="a" fill="var(--fill-warn)" name="Pendente" radius={[0, 0, 0, 0]} id="bar-pendente" />
                  <Bar dataKey="naoProntos" stackId="a" fill="var(--fill-crit)" name="Não Prontos" radius={[8, 8, 0, 0]} id="bar-naoProntos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex-none flex flex-wrap gap-2 justify-center">
              <div className="bg-[#f8faff] dark:bg-gray-800 flex items-center gap-1.5 px-2 py-1 rounded-lg border border-[#f1f3f7] dark:border-gray-700">
                <div className="w-2.5 h-2.5 rounded-full bg-[color:var(--fill-ok)]" />
                <span className="text-xs">Prontos</span>
              </div>
              <div className="bg-[#f8faff] dark:bg-gray-800 flex items-center gap-1.5 px-2 py-1 rounded-lg border border-[#f1f3f7] dark:border-gray-700">
                <div className="w-2.5 h-2.5 rounded-full bg-[color:var(--fill-warn)]" />
                <span className="text-xs">Pendente</span>
              </div>
              <div className="bg-[#f8faff] dark:bg-gray-800 flex items-center gap-1.5 px-2 py-1 rounded-lg border border-[#f1f3f7] dark:border-gray-700">
                <div className="w-2.5 h-2.5 rounded-full bg-[color:var(--fill-crit)]" />
                <span className="text-xs">Não Pronto</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}