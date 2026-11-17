import { SidePanel } from "./ui/side-panel";
import { Button } from "./ui/button";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface InsightsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section?: string;
}

type Tipo = "success" | "warning" | "info";
interface Insight { title: string; type: Tipo; icon: typeof Info; description: string; recommendation: string; metrics: string[]; decisao?: boolean }

const strategicInsights: Insight[] = [
  {
    title: "Faturamento em alta",
    type: "success",
    icon: TrendingUp,
    description: "Faturamento cresceu 6% no último mês: R$ 7,3 mi em junho e R$ 80 mi em 12 meses.",
    recommendation: "Manter a expansão nos CDs 1 e 2, que concentram 62,5% do faturamento.",
    metrics: ["Junho: R$ 7,3 mi (+6%)", "12 meses: R$ 80 mi"],
  },
  {
    title: "Sazonalidade identificada",
    type: "info",
    icon: Info,
    description: "O faturamento subiu de R$ 5,8 mi em fevereiro para R$ 7,3 mi em junho.",
    recommendation: "Preparar capacidade operacional para o pico do segundo semestre.",
    metrics: ["Fev: R$ 5,8 mi", "Jun: R$ 7,3 mi"],
  },
  {
    title: "Concentração em Logística",
    type: "warning",
    icon: AlertTriangle,
    description: "Logística responde por 60% do faturamento, o que concentra risco no portfólio.",
    recommendation: "Ampliar a participação de Marketplace e Crossdocking.",
    metrics: ["Logística: 60%", "Crossdocking: 20%", "Marketplace: 15%"],
  },
];

const tacticalInsights: Insight[] = [
  {
    title: "CD 2 no limite de ocupação",
    type: "warning",
    icon: AlertTriangle,
    description: "CD 2 em 99% de ocupação e SLA em 81%, abaixo da meta de 95%.",
    recommendation: "Redirecionar 15 p.p. da carga para o CD 5, que está em 28%.",
    metrics: ["CD 2: 99%", "SLA CD 2: 81%", "CD 5: 28%"],
    decisao: true,
  },
  {
    title: "Pico de recebimento em julho",
    type: "info",
    icon: Info,
    description: "Julho deve receber 92 mil volumes, 50% acima da média do semestre.",
    recommendation: "Reforçar equipes de recebimento nos CDs 1 e 2.",
    metrics: ["Julho: 92 mil vol.", "Média jan–jun: 61 mil vol."],
  },
  {
    title: "Time-to-Cash equilibrado",
    type: "success",
    icon: CheckCircle,
    description: "90 clientes ativos, com metade dos recebimentos em 90 dias.",
    recommendation: "Manter a política de crédito atual.",
    metrics: ["15 dias: 5 clientes", "90 dias: 45 clientes"],
  },
];

const salesInsights: Insight[] = [
  {
    title: "Conversão abaixo da meta",
    type: "warning",
    icon: TrendingDown,
    description: "25 de 100 leads viraram clientes: conversão de 25%, abaixo da meta de 30%.",
    recommendation: "Qualificar melhor os leads e acelerar a etapa de negociação.",
    metrics: ["Leads: 100", "Propostas: 50", "Clientes: 25"],
  },
  {
    title: "Base concentrada em Logística",
    type: "info",
    icon: Info,
    description: "54 dos 90 clientes ativos são de Logística (60%).",
    recommendation: "Criar campanhas para Marketplace e Crossdocking.",
    metrics: ["Clientes: 90", "Logística: 54"],
  },
];

const financeInsights: Insight[] = [
  {
    title: "Fluxo de caixa positivo",
    type: "success",
    icon: TrendingUp,
    description: "A receber supera a pagar em todos os meses do semestre.",
    recommendation: "Manter a gestão conservadora do caixa e avaliar investimentos em capacidade.",
    metrics: ["A receber jun: R$ 7,1 mi", "A pagar jun: R$ 5,6 mi"],
  },
  {
    title: "Inadimplência concentrada em Logística",
    type: "warning",
    icon: AlertTriangle,
    description: "Logística responde por 51% do valor em atraso em junho.",
    recommendation: "Revisar a política de crédito do segmento e antecipar a cobrança.",
    metrics: ["Logística: R$ 85 mil", "Total: R$ 168 mil (2,3%)"],
  },
  {
    title: "Custo operacional no orçamento",
    type: "success",
    icon: CheckCircle,
    description: "Custo operacional de R$ 1,8 mi no mês, dentro do planejado.",
    recommendation: "Acompanhar a eficiência do CD 1, que concentra o maior custo.",
    metrics: ["Global: R$ 1,8 mi", "CD 1: R$ 800 mil"],
  },
];

const operationsInsights: Insight[] = [
  {
    title: "Ocupação desbalanceada entre CDs",
    type: "warning",
    icon: AlertTriangle,
    description: "CD 2 em 99% enquanto CD 5 está em 28% e CD 4 em 38%.",
    recommendation: "Redistribuir carga do CD 2 para os CDs com folga, começando pelo CD 5.",
    metrics: ["CD 2: 99%", "CD 4: 38%", "CD 5: 28%"],
    decisao: true,
  },
  {
    title: "Não prontos acima do esperado",
    type: "warning",
    icon: AlertTriangle,
    description: "57 volumes não prontos nas janelas de 30 e de 90 dias.",
    recommendation: "Priorizar as pendências de preparação antes do pico.",
    metrics: ["30 dias: 57 não prontos", "90 dias: 87 prontos"],
  },
  {
    title: "SLA na meta nos demais CDs",
    type: "info",
    icon: Info,
    description: "CDs 1, 4 e 5 acima de 95%; CD 3 em 93%, perto da meta.",
    recommendation: "Tratar o CD 2 primeiro e acompanhar o CD 3.",
    metrics: ["CD 5: 98%", "CD 3: 93%", "CD 2: 81%"],
  },
];

export function InsightsModal({ open, onOpenChange, section = "strategic" }: InsightsModalProps) {
  const insights =
    section === "tactical" ? tacticalInsights
    : section === "sales" ? salesInsights
    : section === "finance" ? financeInsights
    : section === "operations" ? operationsInsights
    : strategicInsights;
  const ordem: Record<Tipo, number> = { warning: 0, info: 1, success: 2 };
  const lista = [...insights].sort((x, y) => ordem[x.type] - ordem[y.type]);
  const cor: Record<Tipo, string> = { success: "var(--st-ok)", warning: "var(--st-warn)", info: "var(--data-text)" };
  const rotulo: Record<Tipo, string> = { success: "Positivo", warning: "Atenção", info: "Informação" };

  return (
    <SidePanel
      open={open}
      onOpenChange={onOpenChange}
      title="Insights da Operação"
      description="Leituras do Chronus sobre os indicadores desta tela."
      footer={<Button variant="ghost" onClick={() => onOpenChange(false)}>Fechar</Button>}
    >
      {lista.map((insight) => {
        const Icon = insight.icon;
        return (
          <article key={insight.title} className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: cor[insight.type] }} aria-hidden />
              <div className="min-w-0">
                <p className="text-xs font-semibold" style={{ color: cor[insight.type] }}>{rotulo[insight.type]}</p>
                <h3 className="text-sm font-semibold">{insight.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
              </div>
            </div>
            <p className="text-sm"><span className="font-medium">Recomendação: </span>{insight.recommendation}</p>
            <div className="flex flex-wrap gap-1.5">
              {insight.metrics.map((m) => (
                <span key={m} className="text-xs rounded-md bg-secondary px-2 py-0.5 tabular-nums">{m}</span>
              ))}
            </div>
            {insight.decisao && (
              <p className="text-xs text-muted-foreground">Esta recomendação está na faixa “Exige decisão”, no topo da tela.</p>
            )}
          </article>
        );
      })}
    </SidePanel>
  );
}
