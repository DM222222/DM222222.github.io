import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type Section = "strategic" | "tactical" | "sales" | "finance" | "operations" | "alerts";
export type UserLevel = "c-level" | "diretoria" | "gerencia";

export interface CD {
  id: string;
  nome: string;
  ocupacao: number;
  sla: number;
}

/** Estado inicial do cenário de demonstração (dados fictícios e coerentes entre telas). */
const CDS_INICIAL: CD[] = [
  { id: "cd1", nome: "CD 1", ocupacao: 45, sla: 96 },
  { id: "cd2", nome: "CD 2", ocupacao: 99, sla: 81 },
  { id: "cd3", nome: "CD 3", ocupacao: 62, sla: 93 },
  { id: "cd4", nome: "CD 4", ocupacao: 38, sla: 97 },
  { id: "cd5", nome: "CD 5", ocupacao: 28, sla: 98 },
];

/** Efeito simulado da recomendação: 15 p.p. de carga saem do CD 2 e vão para o CD 5. */
const EFEITO: Record<string, Partial<Pick<CD, "ocupacao" | "sla">>> = {
  cd2: { ocupacao: 84, sla: 93 },
  cd5: { ocupacao: 49, sla: 96 },
};

export type Gravidade = "critical" | "warning" | "info" | "success";

export interface Alerta {
  id: string;
  titulo: string;
  descricao: string;
  gravidade: Gravidade;
  quando: string;
  categoria: string;
  destino: Section;
  resolvido?: boolean;
}

export const LIMITES = {
  ocupacaoCritica: 95,
  ocupacaoAtencao: 85,
  ocupacaoOciosa: 40,
  slaCritico: 85,
  slaAtencao: 95,
};

function montarAlertas(cds: CD[], aplicado: boolean): Alerta[] {
  const cd2 = cds.find((c) => c.id === "cd2")!;
  const cd5 = cds.find((c) => c.id === "cd5")!;
  return [
    {
      id: "cd2-sla",
      titulo: aplicado ? "CD 2 voltou à faixa segura" : "CD 2 deve estourar o SLA no próximo pico",
      descricao: aplicado
        ? `Ocupação em ${cd2.ocupacao}% e SLA em ${cd2.sla}% após redirecionar carga para o CD 5.`
        : `CD 2 com ${cd2.ocupacao}% de ocupação e SLA em ${cd2.sla}%. Sem ação, um pico de demanda quebra o SLA.`,
      gravidade: aplicado ? "success" : "critical",
      quando: aplicado ? "Agora" : "Há 2 horas",
      categoria: "Operação",
      destino: "strategic",
      resolvido: aplicado,
    },
    {
      id: "prontos",
      titulo: "Parte dos clientes ainda não está pronta para operar",
      descricao: "57 volumes não prontos na janela de 30 dias. Priorizar pendências de preparação.",
      gravidade: "warning",
      quando: "Há 1 hora",
      categoria: "Operação",
      destino: "operations",
    },
    {
      id: "cd5-ocioso",
      titulo: aplicado ? "CD 5 absorveu a carga redirecionada" : "CD 5 com espaço ocioso",
      descricao: aplicado
        ? `CD 5 passou para ${cd5.ocupacao}% de ocupação, sem perder SLA (${cd5.sla}%).`
        : `CD 5 opera com ${cd5.ocupacao}% de ocupação. Capacidade disponível para receber carga.`,
      gravidade: aplicado ? "success" : "info",
      quando: aplicado ? "Agora" : "Há 6 horas",
      categoria: "Operação",
      destino: "operations",
      resolvido: aplicado,
    },
    {
      id: "fat",
      titulo: "Faturamento cresceu 24% no último mês",
      descricao: "Faturamento global em R$ 80M. A tendência pede capacidade para o pico sazonal.",
      gravidade: "success",
      quando: "Há 15 minutos",
      categoria: "Financeiro",
      destino: "strategic",
    },
    {
      id: "custo",
      titulo: "Custo operacional dentro do orçamento",
      descricao: "Custos globais de R$ 2M, conforme planejado.",
      gravidade: "success",
      quando: "Há 3 horas",
      categoria: "Financeiro",
      destino: "finance",
    },
    {
      id: "inadimplencia",
      titulo: "Inadimplência em nível aceitável",
      descricao: "Taxa em 2,3%, dentro da meta de menos de 3%.",
      gravidade: "info",
      quando: "Há 4 horas",
      categoria: "Financeiro",
      destino: "finance",
    },
    {
      id: "tfa",
      titulo: "TFA global em 1%",
      descricao: "Faltas e avarias abaixo da meta de 2%.",
      gravidade: "success",
      quando: "Há 5 horas",
      categoria: "Operação",
      destino: "operations",
    },
  ];
}

interface Aplicacao {
  hora: string;
}

interface TorreContextValue {
  section: Section;
  setSection: (s: Section) => void;
  cds: CD[];
  cdsAntes: CD[];
  efeito: Record<string, Partial<Pick<CD, "ocupacao" | "sla">>>;
  aplicado: Aplicacao | null;
  aplicar: () => void;
  desfazer: () => void;
  alertas: Alerta[];
  /** Alertas que ainda pedem ação (críticos + atenção, não resolvidos). */
  alertCount: number;
}

const Ctx = createContext<TorreContextValue | null>(null);

export function TorreProvider({ children, initialSection = "strategic" }: { children: ReactNode; initialSection?: Section }) {
  const [section, setSection] = useState<Section>(initialSection);
  const [aplicado, setAplicado] = useState<Aplicacao | null>(null);

  const cds = useMemo(
    () => CDS_INICIAL.map((c) => (aplicado && EFEITO[c.id] ? { ...c, ...EFEITO[c.id] } : c)),
    [aplicado],
  );

  const alertas = useMemo(() => montarAlertas(cds, !!aplicado), [cds, aplicado]);
  const alertCount = alertas.filter((a) => !a.resolvido && (a.gravidade === "critical" || a.gravidade === "warning")).length;

  const aplicar = useCallback(() => {
    const d = new Date();
    setAplicado({ hora: d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) });
  }, []);
  const desfazer = useCallback(() => setAplicado(null), []);

  const value: TorreContextValue = {
    section,
    setSection,
    cds,
    cdsAntes: CDS_INICIAL,
    efeito: EFEITO,
    aplicado,
    aplicar,
    desfazer,
    alertas,
    alertCount,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTorre() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTorre fora do TorreProvider");
  return v;
}
