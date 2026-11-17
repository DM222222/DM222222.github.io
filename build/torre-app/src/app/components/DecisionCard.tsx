import { useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, Sparkles, Undo2 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { useTorre } from "../state/torre";
import { ESTADO_INFO, estadoOcupacao, estadoSla } from "./status";

function Linha({ rotulo, antes, depois, tipo }: { rotulo: string; antes: number; depois: number; tipo: "ocup" | "sla" }) {
  const eAntes = tipo === "ocup" ? estadoOcupacao(antes) : estadoSla(antes);
  const eDepois = tipo === "ocup" ? estadoOcupacao(depois) : estadoSla(depois);
  const A = ESTADO_INFO[eAntes];
  const D = ESTADO_INFO[eDepois];
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
      <span className="text-muted-foreground">{rotulo}</span>
      <span className="flex items-center gap-2 font-semibold tabular-nums">
        <span className="inline-flex items-center gap-1" style={{ color: A.cor }}>
          <A.Icon className="h-3.5 w-3.5" aria-hidden />
          {antes}%
        </span>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
        <span className="inline-flex items-center gap-1" style={{ color: D.cor }}>
          <D.Icon className="h-3.5 w-3.5" aria-hidden />
          {depois}%
        </span>
      </span>
    </div>
  );
}

export function DecisionCard(_props: { compact?: boolean }) {
  const { cds, cdsAntes, efeito, aplicado, aplicar, desfazer, setSection, section } = useTorre();
  const [confirmando, setConfirmando] = useState(false);
  const [detalhes, setDetalhes] = useState(false);

  const antes = (id: string) => cdsAntes.find((c) => c.id === id)!;
  const depois = (id: string) => ({ ...antes(id), ...efeito[id] });
  const cd2 = aplicado ? cds.find((c) => c.id === "cd2")! : antes("cd2");
  const slaA = ESTADO_INFO[estadoSla(antes("cd2").sla)];
  const slaD = ESTADO_INFO[estadoSla(depois("cd2").sla)];

  if (aplicado) {
    return (
      <div
        role="status"
        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-xl border border-border border-l-4 bg-card px-4 py-2.5"
        style={{ borderLeftColor: "var(--st-ok)" }}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "var(--st-ok)" }} aria-hidden />
          <p className="text-sm truncate">
            <span className="font-semibold">Recomendação aplicada às {aplicado.hora}.</span>{" "}
            <span className="text-muted-foreground">CD 2 em {cd2.ocupacao}% de ocupação e SLA {cd2.sla}%.</span>
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 flex-shrink-0" onClick={desfazer}>
          <Undo2 className="h-4 w-4" aria-hidden />
          Desfazer
        </Button>
      </div>
    );
  }

  return (
    <>
      <div
        className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 rounded-xl border border-border border-l-4 bg-card px-4 py-2.5"
        style={{ borderLeftColor: "var(--st-crit)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold flex-shrink-0" style={{ color: "var(--st-crit)" }}>
            <AlertTriangle className="h-4 w-4" aria-hidden />
            Exige decisão
          </span>
          <p className="text-sm font-semibold leading-snug min-w-0">CD 2 deve estourar o SLA no próximo pico</p>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tabular-nums flex-shrink-0">
            <span className="text-muted-foreground font-medium">SLA</span>
            <span className="inline-flex items-center gap-1" style={{ color: slaA.cor }}>
              <slaA.Icon className="h-3.5 w-3.5" aria-hidden />
              {antes("cd2").sla}%
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
            <span className="inline-flex items-center gap-1" style={{ color: slaD.cor }}>
              <slaD.Icon className="h-3.5 w-3.5" aria-hidden />
              {depois("cd2").sla}%
            </span>
          </span>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button size="sm" className="gap-2 flex-1 sm:flex-none" onClick={() => setConfirmando(true)}>
            <Sparkles className="h-4 w-4" aria-hidden />
            Aplicar recomendação
          </Button>
          <Button size="sm" variant="ghost" className="flex-1 sm:flex-none" onClick={() => setDetalhes(true)}>
            Ver detalhes
          </Button>
        </div>
      </div>

      {/* Painel lateral com o contexto completo da decisão */}
      <Dialog open={detalhes} onOpenChange={setDetalhes}>
        <DialogContent className="top-0 left-auto right-0 translate-x-0 translate-y-0 h-full w-full max-w-[min(100%,28rem)] sm:max-w-md rounded-none border-0 border-l content-start overflow-y-auto data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100">
          <DialogHeader>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: "var(--st-crit)" }}>
              <AlertTriangle className="h-4 w-4" aria-hidden />
              Exige decisão
            </span>
            <DialogTitle className="text-xl leading-snug">CD 2 deve estourar o SLA no próximo pico</DialogTitle>
            <DialogDescription>
              Ocupação em {cd2.ocupacao}% e SLA em {cd2.sla}%, abaixo da meta de 95%. O CD 5 tem{" "}
              {100 - antes("cd5").ocupacao}% de capacidade livre.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-2 rounded-lg bg-secondary p-3">
            <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "var(--data-text)" }} aria-hidden />
            <p className="text-sm">
              <span className="font-semibold">Recomendação do Chronus: </span>
              redirecionar 15 p.p. da carga do CD 2 para o CD 5.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">Efeito estimado</p>
            <div className="divide-y divide-border">
              <Linha rotulo="CD 2 · ocupação" antes={antes("cd2").ocupacao} depois={depois("cd2").ocupacao} tipo="ocup" />
              <Linha rotulo="CD 2 · SLA" antes={antes("cd2").sla} depois={depois("cd2").sla} tipo="sla" />
              <Linha rotulo="CD 5 · ocupação" antes={antes("cd5").ocupacao} depois={depois("cd5").ocupacao} tipo="ocup" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button className="gap-2" onClick={() => { setDetalhes(false); setConfirmando(true); }}>
              <Sparkles className="h-4 w-4" aria-hidden />
              Aplicar recomendação
            </Button>
            {section !== "operations" && (
              <Button variant="outline" className="gap-2" onClick={() => { setDetalhes(false); setSection("operations"); }}>
                Ver evidência na Operação
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmando} onOpenChange={setConfirmando}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redirecionar carga do CD 2 para o CD 5?</DialogTitle>
            <DialogDescription>Confira o efeito estimado. Você pode desfazer depois.</DialogDescription>
          </DialogHeader>
          <div className="divide-y divide-border">
            <Linha rotulo="CD 2 · ocupação" antes={antes("cd2").ocupacao} depois={depois("cd2").ocupacao} tipo="ocup" />
            <Linha rotulo="CD 2 · SLA" antes={antes("cd2").sla} depois={depois("cd2").sla} tipo="sla" />
            <Linha rotulo="CD 5 · ocupação" antes={antes("cd5").ocupacao} depois={depois("cd5").ocupacao} tipo="ocup" />
          </div>
          <p className="text-xs text-muted-foreground">Simulação com dados fictícios para demonstração.</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmando(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                aplicar();
                setConfirmando(false);
              }}
            >
              Confirmar e aplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
