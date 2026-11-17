import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Check, CheckCircle2, Sparkles, Undo2 } from "lucide-react";
import { Button } from "./ui/button";
import { SidePanel } from "./ui/side-panel";
import { simular, useTorre } from "../state/torre";
import { ESTADO_INFO, estadoOcupacao, estadoSla } from "./status";

function Linha({ rotulo, antes, depois, tipo }: { rotulo: string; antes: number; depois: number; tipo: "ocup" | "sla" }) {
  const A = ESTADO_INFO[tipo === "ocup" ? estadoOcupacao(antes) : estadoSla(antes)];
  const D = ESTADO_INFO[tipo === "ocup" ? estadoOcupacao(depois) : estadoSla(depois)];
  return (
    <div className="flex items-center justify-between gap-3 py-2 text-sm">
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

const ETAPAS = ["Análise", "Ajuste", "Aprovação"];
const DESTINOS = [
  { id: "cd5", nome: "CD 5" },
  { id: "cd4", nome: "CD 4" },
];
const JANELAS = ["Próximo pico (amanhã, 6h)", "Turno 2 de hoje (14h)"];
const RESPONSAVEIS = ["Coordenação do CD 2", "Coordenação do CD de destino", "Planejamento logístico"];

const campo = "w-full rounded-md border border-border bg-input-background px-3 py-2 text-sm";

export function DecisionCard(_props: { compact?: boolean }) {
  const { cds, cdsAntes, aplicado, aplicar, desfazer, setSection, section } = useTorre();
  const [aberto, setAberto] = useState(false);
  const [etapa, setEtapa] = useState(0);
  const [pp, setPp] = useState(15);
  const [destino, setDestino] = useState("cd5");
  const [janela, setJanela] = useState(JANELAS[0]);
  const [responsavel, setResponsavel] = useState(RESPONSAVEIS[0]);
  const [justificativa, setJustificativa] = useState("Evitar a quebra do SLA do CD 2 no próximo pico de demanda.");
  const [ciente, setCiente] = useState(false);

  useEffect(() => {
    if (aberto) { setEtapa(0); setCiente(false); }
  }, [aberto]);

  const antes = (id: string) => cdsAntes.find((c) => c.id === id)!;
  const ef = useMemo(() => simular(pp, destino), [pp, destino]);
  const depois = (id: string) => ({ ...antes(id), ...ef[id] });
  const nomeDestino = DESTINOS.find((d) => d.id === destino)!.nome;
  const alcadaDiretoria = pp > 10;
  const cd2 = antes("cd2");
  const padrao = simular(15, "cd5");

  if (aplicado) {
    const atual = cds.find((c) => c.id === "cd2")!;
    const dest = DESTINOS.find((d) => d.id === aplicado.destino)!.nome;
    return (
      <div
        role="status"
        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-xl border border-border border-l-4 bg-card px-4 py-2.5"
        style={{ borderLeftColor: "var(--st-ok)" }}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "var(--st-ok)" }} aria-hidden />
          <p className="text-sm">
            <span className="font-semibold">Aprovado às {aplicado.hora} e em execução.</span>{" "}
            <span className="text-muted-foreground">
              {aplicado.pp} p.p. do CD 2 para o {dest} · CD 2 em {atual.ocupacao}% de ocupação e SLA {atual.sla}%.
            </span>
          </p>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 flex-shrink-0" onClick={desfazer}>
          <Undo2 className="h-4 w-4" aria-hidden />
          Desfazer
        </Button>
      </div>
    );
  }

  const rodape =
    etapa === 0 ? (
      <>
        <Button variant="ghost" onClick={() => setAberto(false)}>Cancelar</Button>
        <Button onClick={() => setEtapa(1)}>Continuar</Button>
      </>
    ) : etapa === 1 ? (
      <>
        <Button variant="ghost" onClick={() => setEtapa(0)}>Voltar</Button>
        <Button onClick={() => setEtapa(2)}>Continuar</Button>
      </>
    ) : (
      <>
        <Button variant="ghost" onClick={() => setEtapa(1)}>Voltar</Button>
        <Button
          disabled={!ciente}
          onClick={() => {
            aplicar({ pp, destino, janela, responsavel });
            setAberto(false);
          }}
        >
          Aprovar e executar
        </Button>
      </>
    );

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
          <span className="text-xs text-muted-foreground flex-shrink-0">
            Chronus recomenda redirecionar 15 p.p. para o CD 5 · SLA {cd2.sla}% → {padrao.cd2.sla}%
          </span>
        </div>
        <Button size="sm" className="flex-shrink-0" onClick={() => setAberto(true)}>
          Revisar e aprovar
        </Button>
      </div>

      <SidePanel
        open={aberto}
        onOpenChange={setAberto}
        eyebrow={
          <span className="inline-flex items-center gap-1.5 text-xs font-bold mb-1" style={{ color: "var(--st-crit)" }}>
            <AlertTriangle className="h-4 w-4" aria-hidden />
            Exige decisão
          </span>
        }
        title="CD 2 deve estourar o SLA no próximo pico"
        description={
          <ol className="flex items-center gap-2 mt-3" aria-label="Etapas">
            {ETAPAS.map((nome, i) => (
              <li key={nome} className="flex items-center gap-2 text-xs font-medium" aria-current={i === etapa ? "step" : undefined}>
                <span
                  className={
                    "grid place-items-center h-5 w-5 rounded-full text-[11px] " +
                    (i < etapa ? "bg-primary text-primary-foreground" : i === etapa ? "border-2 border-primary text-foreground" : "border border-border text-muted-foreground")
                  }
                >
                  {i < etapa ? <Check className="h-3 w-3" aria-hidden /> : i + 1}
                </span>
                <span className={i === etapa ? "text-foreground" : "text-muted-foreground"}>{nome}</span>
                {i < ETAPAS.length - 1 && <span className="w-4 h-px bg-border" aria-hidden />}
              </li>
            ))}
          </ol>
        }
        footer={rodape}
      >
        {etapa === 0 && (
          <>
            <p className="text-sm text-muted-foreground">
              Ocupação em {cd2.ocupacao}% e SLA em {cd2.sla}%, abaixo da meta de 95%. O CD 5 tem {100 - antes("cd5").ocupacao}% de
              capacidade livre e o CD 4, {100 - antes("cd4").ocupacao}%.
            </p>
            <div className="flex items-start gap-2 rounded-lg bg-secondary p-3">
              <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "var(--data-text)" }} aria-hidden />
              <p className="text-sm">
                <span className="font-semibold">Recomendação do Chronus: </span>
                redirecionar 15 p.p. da carga do CD 2 para o CD 5 antes do próximo pico.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Efeito estimado</p>
              <div className="divide-y divide-border">
                <Linha rotulo="CD 2 · ocupação" antes={cd2.ocupacao} depois={padrao.cd2.ocupacao!} tipo="ocup" />
                <Linha rotulo="CD 2 · SLA" antes={cd2.sla} depois={padrao.cd2.sla!} tipo="sla" />
                <Linha rotulo="CD 5 · ocupação" antes={antes("cd5").ocupacao} depois={padrao.cd5.ocupacao!} tipo="ocup" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Riscos considerados</p>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li>Transferência extra de cerca de R$ 18 mil no período.</li>
                <li>Prazo de execução: 4 horas antes do pico.</li>
                <li>CD 5 continua abaixo de 50% de ocupação.</li>
              </ul>
            </div>
            {section !== "operations" && (
              <Button
                variant="link"
                className="px-0 gap-1"
                onClick={() => {
                  setAberto(false);
                  setSection("operations");
                }}
              >
                Ver evidência na Operação
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            )}
          </>
        )}

        {etapa === 1 && (
          <>
            <div>
              <label htmlFor="pp" className="text-sm font-medium flex justify-between">
                Carga a redirecionar <span className="tabular-nums">{pp} p.p.</span>
              </label>
              <input
                id="pp" type="range" min={5} max={20} step={1} value={pp}
                onChange={(e) => setPp(Number(e.target.value))}
                className="w-full mt-2 accent-[color:var(--ramp-1)]"
              />
              <div className="flex justify-between text-xs text-muted-foreground"><span>5 p.p.</span><span>20 p.p.</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="destino" className="text-sm font-medium">CD de destino</label>
                <select id="destino" className={campo + " mt-1"} value={destino} onChange={(e) => setDestino(e.target.value)}>
                  {DESTINOS.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="janela" className="text-sm font-medium">Quando</label>
                <select id="janela" className={campo + " mt-1"} value={janela} onChange={(e) => setJanela(e.target.value)}>
                  {JANELAS.map((j) => <option key={j}>{j}</option>)}
                </select>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Efeito com o seu ajuste</p>
              <div className="divide-y divide-border">
                <Linha rotulo="CD 2 · ocupação" antes={cd2.ocupacao} depois={depois("cd2").ocupacao} tipo="ocup" />
                <Linha rotulo="CD 2 · SLA" antes={cd2.sla} depois={depois("cd2").sla} tipo="sla" />
                <Linha rotulo={`${nomeDestino} · ocupação`} antes={antes(destino).ocupacao} depois={depois(destino).ocupacao} tipo="ocup" />
              </div>
            </div>
          </>
        )}

        {etapa === 2 && (
          <>
            <div className="rounded-lg bg-secondary p-3 text-sm space-y-1">
              <p><span className="text-muted-foreground">Ação: </span>{pp} p.p. do CD 2 para o {nomeDestino}</p>
              <p><span className="text-muted-foreground">Quando: </span>{janela}</p>
              <p><span className="text-muted-foreground">SLA do CD 2: </span>{cd2.sla}% → {depois("cd2").sla}%</p>
            </div>
            <div>
              <label htmlFor="resp" className="text-sm font-medium">Responsável pela execução</label>
              <select id="resp" className={campo + " mt-1"} value={responsavel} onChange={(e) => setResponsavel(e.target.value)}>
                {RESPONSAVEIS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="just" className="text-sm font-medium">Justificativa</label>
              <textarea id="just" rows={3} className={campo + " mt-1 resize-none"} value={justificativa} onChange={(e) => setJustificativa(e.target.value)} />
            </div>
            <p className="text-xs text-muted-foreground">
              Alçada: {alcadaDiretoria ? "acima de 10 p.p. exige Diretoria de Operações ou C-Level." : "até 10 p.p. a Gerência aprova."} Seu perfil pode aprovar.
            </p>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[color:var(--ramp-1)]" checked={ciente} onChange={(e) => setCiente(e.target.checked)} />
              Revisei o impacto no {nomeDestino} e autorizo a execução.
            </label>
            <p className="text-xs text-muted-foreground">Simulação com dados fictícios para demonstração.</p>
          </>
        )}
      </SidePanel>
    </>
  );
}
