import { AlertTriangle, AlertCircle, CheckCircle2, MinusCircle } from "lucide-react";
import { LIMITES } from "../state/torre";

export type Estado = "crit" | "warn" | "ok" | "idle";

export const ESTADO_INFO: Record<Estado, { label: string; cor: string; Icon: typeof AlertTriangle }> = {
  crit: { label: "Crítico", cor: "var(--st-crit)", Icon: AlertTriangle },
  warn: { label: "Atenção", cor: "var(--st-warn)", Icon: AlertCircle },
  ok: { label: "Normal", cor: "var(--st-ok)", Icon: CheckCircle2 },
  idle: { label: "Ociosa", cor: "var(--st-idle)", Icon: MinusCircle },
};

export function estadoOcupacao(p: number): Estado {
  if (p >= LIMITES.ocupacaoCritica) return "crit";
  if (p >= LIMITES.ocupacaoAtencao) return "warn";
  if (p < LIMITES.ocupacaoOciosa) return "idle";
  return "ok";
}

export function estadoSla(p: number): Estado {
  if (p < LIMITES.slaCritico) return "crit";
  if (p < LIMITES.slaAtencao) return "warn";
  return "ok";
}

/** Estado nunca só por cor: ícone + rótulo + cor. */
export function StatusPill({ estado, className = "" }: { estado: Estado; className?: string }) {
  const { label, cor, Icon } = ESTADO_INFO[estado];
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${className}`} style={{ color: cor }}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </span>
  );
}
