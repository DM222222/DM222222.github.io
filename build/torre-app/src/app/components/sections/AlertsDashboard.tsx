import { Card, CardContent } from "../ui/card";
import { AlertTriangle, AlertCircle, Info, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useTorre, type Alerta, type Gravidade, type Section } from "../../state/torre";

const ROTULO_DESTINO: Record<Section, string> = {
  strategic: "Abrir Estratégico",
  tactical: "Abrir Tático",
  sales: "Abrir Vendas",
  finance: "Abrir Financeiro",
  operations: "Abrir Operação",
  alerts: "Abrir Alertas",
};

const META: Record<Gravidade, { rotulo: string; cor: string; Icon: typeof Info }> = {
  critical: { rotulo: "Crítico", cor: "var(--st-crit)", Icon: AlertTriangle },
  warning: { rotulo: "Atenção", cor: "var(--st-warn)", Icon: AlertCircle },
  info: { rotulo: "Info", cor: "var(--st-idle)", Icon: Info },
  success: { rotulo: "Normal", cor: "var(--st-ok)", Icon: CheckCircle2 },
};

export function AlertsDashboard() {
  const { alertas, setSection } = useTorre();
  const criticos = alertas.filter((a) => a.gravidade === "critical");
  const atencao = alertas.filter((a) => a.gravidade === "warning");
  const infos = alertas.filter((a) => a.gravidade === "info" || a.gravidade === "success");

  const AlertCard = ({ alerta }: { alerta: Alerta }) => {
    const m = META[alerta.gravidade];
    return (
      <Card className="border-l-4" style={{ borderLeftColor: m.cor }}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-0.5" style={{ color: m.cor }}>
              <m.Icon className="h-5 w-5" aria-hidden />
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{alerta.titulo}</h3>
                <span className="text-xs font-semibold flex-shrink-0" style={{ color: m.cor }}>
                  {alerta.resolvido ? "Resolvido" : m.rotulo}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{alerta.descricao}</p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{alerta.categoria}</span>
                  <span aria-hidden>•</span>
                  <span>{alerta.quando}</span>
                </div>
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => setSection(alerta.destino)}>
                  {ROTULO_DESTINO[alerta.destino]}
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const lista = (itens: Alerta[]) =>
    itens.length ? (
      itens.map((a) => <AlertCard key={a.id} alerta={a} />)
    ) : (
      <p className="text-sm text-muted-foreground py-6 text-center">Nada nesta categoria.</p>
    );

  const resumo = [
    { rotulo: "Críticos", n: criticos.length, m: META.critical },
    { rotulo: "Atenção", n: atencao.length, m: META.warning },
    { rotulo: "Informativos", n: infos.length, m: META.info },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Central de Alertas</h2>
        <p className="text-muted-foreground">Notificações e avisos das operações</p>
      </div>

      <div className="grid gap-4 grid-cols-3">
        {resumo.map(({ rotulo, n, m }) => (
          <Card key={rotulo}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">{rotulo}</p>
                  <p className="text-3xl font-bold tabular-nums" style={{ color: m.cor }}>
                    {n}
                  </p>
                </div>
                <m.Icon className="h-6 w-6 md:h-8 md:w-8" style={{ color: m.cor }} aria-hidden />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos ({alertas.length})</TabsTrigger>
          <TabsTrigger value="critical">Críticos ({criticos.length})</TabsTrigger>
          <TabsTrigger value="warning">Atenção ({atencao.length})</TabsTrigger>
          <TabsTrigger value="info">Info ({infos.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 mt-6">{lista(alertas)}</TabsContent>
        <TabsContent value="critical" className="space-y-4 mt-6">{lista(criticos)}</TabsContent>
        <TabsContent value="warning" className="space-y-4 mt-6">{lista(atencao)}</TabsContent>
        <TabsContent value="info" className="space-y-4 mt-6">{lista(infos)}</TabsContent>
      </Tabs>
    </div>
  );
}
