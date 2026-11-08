import { useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, Sparkles, Undo2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
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

export function DecisionCard({ compact = false }: { compact?: boolean }) {
  const { cds, cdsAntes, efeito, aplicado, aplicar, desfazer, setSection, section } = useTorre();
  const [confirmando, setConfirmando] = useState(false);

  const antes = (id: string) => cdsAntes.find((c) => c.id === id)!;
  const depois = (id: string) => ({ ...antes(id), ...efeito[id] });
  const cd2 = aplicado ? cds.find((c) => c.id === "cd2")! : antes("cd2");

  if (aplicado) {
    return (
      <Card className="border-l-4" style={{ borderLeftColor: "var(--st-ok)" }} role="status">
        <CardContent className={compact ? "p-3 md:p-4" : "p-4 md:p-5"}>
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "var(--st-ok)" }} aria-hidden />
              <div>
                <p className="font-semibold">Recomendação aplicada às {aplicado.hora}</p>
                <p className="text-sm text-muted-foreground">
                  CD 2 em {cd2.ocupacao}% de ocupação e SLA {cd2.sla}%. Carga redirecionada para o CD 5. Os números já
                  mudaram em todas as telas e o contador de alertas foi atualizado.
                </p>
              </div>
            </div>
            <Button variant="outline" className="gap-2 w-full md:w-auto flex-shrink-0" onClick={desfazer}>
              <Undo2 className="h-4 w-4" aria-hidden />
              Desfazer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-l-4" style={{ borderLeftColor: "var(--st-crit)" }}>
        <CardContent className={compact ? "p-3 md:p-4" : "p-4 md:p-5"}>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            <div className="flex-1 min-w-0">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide"
                style={{ color: "var(--st-crit)" }}
              >
                <AlertTriangle className="h-4 w-4" aria-hidden />
                Exige decisão
              </span>
              <h3 className="mt-1 text-lg md:text-xl font-bold leading-snug">CD 2 deve estourar o SLA no próximo pico</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ocupação em {cd2.ocupacao}% e SLA em {cd2.sla}%, abaixo da meta de {95}%. O CD 5 tem{" "}
                {100 - antes("cd5").ocupacao}% de capacidade livre.
              </p>
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-secondary p-3">
                <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "var(--data-text)" }} aria-hidden />
                <p className="text-sm">
                  <span className="font-semibold">Recomendação do Chronus: </span>
                  redirecionar 15 p.p. da carga do CD 2 para o CD 5.
                </p>
              </div>
            </div>

            {!compact && (
              <div className="lg:w-72 flex-shrink-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Efeito estimado</p>
                <div className="divide-y divide-border">
                  <Linha rotulo="CD 2 · ocupação" antes={antes("cd2").ocupacao} depois={depois("cd2").ocupacao} tipo="ocup" />
                  <Linha rotulo="CD 2 · SLA" antes={antes("cd2").sla} depois={depois("cd2").sla} tipo="sla" />
                  <Linha rotulo="CD 5 · ocupação" antes={antes("cd5").ocupacao} depois={depois("cd5").ocupacao} tipo="ocup" />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Button className="gap-2" onClick={() => setConfirmando(true)}>
              <Sparkles className="h-4 w-4" aria-hidden />
              Aplicar recomendação
            </Button>
            {section !== "operations" && (
              <Button variant="outline" className="gap-2" onClick={() => setSection("operations")}>
                Ver evidência na Operação
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

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
