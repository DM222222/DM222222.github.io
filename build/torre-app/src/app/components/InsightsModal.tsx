import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface InsightsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section?: string;
}

const strategicInsights = [
  {
    title: "Crescimento Sustentável",
    type: "success",
    icon: TrendingUp,
    description: "Faturamento global cresceu 24% vs último mês, atingindo R$80M.",
    recommendation: "Manter estratégia de expansão nos CDs principais que concentram 62,5% do faturamento.",
    metrics: ["Faturamento: R$80M (+24%)", "Meta Q4: R$320M"],
  },
  {
    title: "Sazonalidade Identificada",
    type: "info",
    icon: Info,
    description: "Pico de vendas entre Set-Nov com volumes acima de R$2M mensais.",
    recommendation: "Preparar capacidade operacional adicional para período sazonal Q3/Q4.",
    metrics: ["Pico Setembro: R$1.8M", "Pico Outubro: R$2.3M"],
  },
  {
    title: "Distribuição de Clientes",
    type: "warning",
    icon: AlertTriangle,
    description: "Concentração em Logística (60%) pode representar risco de portfólio.",
    recommendation: "Diversificar base de clientes aumentando participação em Marketplace e Crossdocking.",
    metrics: ["Logística: 60%", "Crossdocking: 20%", "Marketplace: 15%"],
  },
];

const tacticalInsights = [
  {
    title: "Time-to-Cash Equilibrado",
    type: "success",
    icon: CheckCircle,
    description: "90 clientes ativos com recebimentos bem distribuídos entre 15-90 dias.",
    recommendation: "Manter política de crédito atual, sem concentração de risco.",
    metrics: ["90 dias: 45 clientes", "Volume: R$ 3M"],
  },
  {
    title: "CD 2 no limite de ocupação",
    type: "warning",
    icon: AlertTriangle,
    description: "CD 2 está com 99% de ocupação e SLA em 81%, abaixo da meta de 95%.",
    recommendation: "Redirecionar 15 p.p. da carga para o CD 5 (28% de ocupação). Aplique na tela Estratégico.",
    metrics: ["CD 2: 99%", "SLA CD 2: 81%", "CD 5: 28%"],
  },
  {
    title: "Previsão de Recebimento Julho",
    type: "info",
    icon: Info,
    description: "Pico de recebimento esperado em julho com volumes 40% acima da média.",
    recommendation: "Ajustar planejamento financeiro e fluxo de caixa para comportar aumento.",
    metrics: ["Previsão Julho: R$92M", "Média mensal: R$65M"],
  },
];

const salesInsights = [
  {
    title: "Distribuição de Segmentos",
    type: "info",
    icon: Info,
    description: "Logística representa 60% da base de clientes, seguido por Crossdocking (20%).",
    recommendation: "Criar campanhas específicas para atrair clientes de Marketplace e outros segmentos.",
    metrics: ["Total clientes: 90", "Logística: 54 clientes"],
  },
  {
    title: "Conversão do Funil",
    type: "warning",
    icon: TrendingDown,
    description: "Taxa de conversão Lead → Cliente em 3%, abaixo da meta de 8%.",
    recommendation: "Melhorar qualificação de leads e processo de follow-up nas etapas de Oportunidade e Negociação.",
    metrics: ["Lead: 70%", "Oportunidade: 20%", "Cliente: 3%"],
  },
];

const financeInsights = [
  {
    title: "Fluxo de Caixa Positivo",
    type: "success",
    icon: TrendingUp,
    description: "Contas a receber superam contas a pagar em todos os meses do semestre.",
    recommendation: "Manter gestão conservadora do caixa e considerar investimentos em expansão.",
    metrics: ["A Receber Jun: R$2.8M", "A Pagar Jun: R$1.1M"],
  },
  {
    title: "Inadimplência Logística Elevada",
    type: "warning",
    icon: AlertTriangle,
    description: "Segmento de Logística concentra maior inadimplência (42% do total).",
    recommendation: "Revisar política de crédito e implementar gestão proativa de cobranças.",
    metrics: ["Logística: 42%", "Crossdocking: 11%", "Outros: 47%"],
  },
  {
    title: "Custo Operacional Equilibrado",
    type: "success",
    icon: CheckCircle,
    description: "Custo operacional global de R$2M está dentro do orçamento planejado.",
    recommendation: "Monitorar eficiência operacional por CD para identificar oportunidades de otimização.",
    metrics: ["Custo Global: R$2M", "Maior custo: Matriz/Viana/Civit (R$500K cada)"],
  },
];

const operationsInsights = [
  {
    title: "Ocupação desbalanceada entre CDs",
    type: "warning",
    icon: AlertTriangle,
    description: "CD 2 em 99% enquanto CD 5 está em 28% e CD 4 em 38%.",
    recommendation: "Redistribuir carga do CD 2 para os CDs com folga, começando pelo CD 5.",
    metrics: ["CD 2: 99%", "CD 4: 38%", "CD 5: 28%"],
  },
  {
    title: "SLA por CD Variável",
    type: "info",
    icon: Info,
    description: "SLA varia entre CDs: CD 5 em 98%, CD 2 em 81%.",
    recommendation: "Tratar o CD 2 primeiro; os demais estão na faixa da meta (95%) ou perto dela.",
    metrics: ["Melhor: CD 5 (98%)", "Atenção: CD 2 (81%)"],
  },
  {
    title: "Prontos para Operar",
    type: "warning",
    icon: AlertTriangle,
    description: "Apenas 62 volumes prontos em 90 dias, com 117 não prontos.",
    recommendation: "Investigar gargalos no processo de preparação e melhorar gestão de pendências.",
    metrics: ["Prontos: 62", "Pendentes: 3", "Não Prontos: 117"],
  },
];

export function InsightsModal({ open, onOpenChange, section = "strategic" }: InsightsModalProps) {
  const getInsightsBySection = () => {
    switch (section) {
      case "strategic":
        return strategicInsights;
      case "tactical":
        return tacticalInsights;
      case "sales":
        return salesInsights;
      case "finance":
        return financeInsights;
      case "operations":
        return operationsInsights;
      default:
        return strategicInsights;
    }
  };

  const insights = getInsightsBySection();

  const getIconColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "error":
        return "text-red-500";
      default:
        return "text-blue-500";
    }
  };

  const getBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case "success":
        return "default";
      case "warning":
        return "secondary";
      case "error":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Insights da Operação</DialogTitle>
          <DialogDescription>
            Análises e recomendações baseadas nos KPIs operacionais
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="success">Sucessos</TabsTrigger>
            <TabsTrigger value="warning">Alertas</TabsTrigger>
            <TabsTrigger value="info">Informações</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Icon className={`h-5 w-5 mt-0.5 ${getIconColor(insight.type)}`} />
                        <div>
                          <CardTitle className="text-base">{insight.title}</CardTitle>
                          <CardDescription className="mt-1">{insight.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={getBadgeVariant(insight.type)} className="capitalize">
                        {insight.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">Recomendação:</p>
                        <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Métricas chave:</p>
                        <div className="flex flex-wrap gap-2">
                          {insight.metrics.map((metric, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="success" className="mt-4 space-y-4">
            {insights.filter(i => i.type === "success").map((insight, index) => {
              const Icon = insight.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${getIconColor(insight.type)}`} />
                      <div>
                        <CardTitle className="text-base">{insight.title}</CardTitle>
                        <CardDescription className="mt-1">{insight.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="warning" className="mt-4 space-y-4">
            {insights.filter(i => i.type === "warning").map((insight, index) => {
              const Icon = insight.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${getIconColor(insight.type)}`} />
                      <div>
                        <CardTitle className="text-base">{insight.title}</CardTitle>
                        <CardDescription className="mt-1">{insight.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="info" className="mt-4 space-y-4">
            {insights.filter(i => i.type === "info").map((insight, index) => {
              const Icon = insight.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${getIconColor(insight.type)}`} />
                      <div>
                        <CardTitle className="text-base">{insight.title}</CardTitle>
                        <CardDescription className="mt-1">{insight.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}