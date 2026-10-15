(function () {
'use strict';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const nf = (v, d) => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: d == null ? 1 : d, maximumFractionDigits: d == null ? 1 : d });
const money = v => 'R$ ' + nf(v, 1) + 'M';
const pct = (v, d) => nf(v, d == null ? 1 : d) + '%';
const sum = a => a.reduce((x, y) => x + y, 0);
const wide = () => !!(window.matchMedia && window.matchMedia('(min-width:1100px)').matches);

/* ---------- dados fictícios, num único modelo coerente ---------- */
const CDS = ['CD 1', 'CD 2', 'CD 3', 'CD 4', 'CD 5'];
const CAP = [12000, 10000, 9000, 8000, 6000];
const B = {
  occ: [74, 97, 82, 61, 28], sla: [97.8, 91.2, 94.1, 98.4, 99.1], tfa: [0.8, 1.4, 1.1, 0.7, 0.9],
  fat: [30, 20, 15, 10, 5], custo: [0.80, 0.40, 0.30, 0.20, 0.10], orc: [0.82, 0.42, 0.32, 0.22, 0.12], prev: [70, 88, 80, 65, 40],
  cmc: [[26, 24, 19], [29, 27, 22], [24, 22, 17], [21, 20, 15], [14, 13, 10]],
  pronto: [{ h: '15 dias', p: 118, q: 22, n: 10 }, { h: '30 dias', p: 96, q: 38, n: 26 }, { h: '60 dias', p: 84, q: 46, n: 40 }, { h: '90 dias', p: 70, q: 52, n: 58 }]
};
const META_SLA = 95, LIM_OCC = 80, META_TFA = 2, META_INAD = 3;
const SEG = [
  { n: 'Logística', fat: 60, cli: 52, score: 82, inad: 1.9 }, { n: 'Crossdocking', fat: 20, cli: 19, score: 79, inad: 2.1 },
  { n: 'Marketplace', fat: 15, cli: 14, score: 68, inad: 3.8 }, { n: 'Outros', fat: 5, cli: 5, score: 74, inad: 2.9 }];
const TTC = [{ l: 'Até 15 dias', v: 5 }, { l: 'Até 30 dias', v: 10 }, { l: 'Até 60 dias', v: 30 }, { l: 'Até 90 dias', v: 45 }];
const FUNIL = [{ l: 'Oportunidade', u: 'leads', v: 100 }, { l: 'Negociação', u: 'em negociação', v: 75 }, { l: 'Proposta', u: 'propostas', v: 50 }, { l: 'Cliente', u: 'clientes', v: 25 }];
const PER = {
  semana: { n: 'Semana', d: 'Últimas 8 semanas (S8 = atual)', L: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'] },
  mes: { n: 'Mês', d: 'Últimos 12 meses', L: ['Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'] },
  ano: { n: 'Ano', d: 'Por ano (2026* = últimos 12 meses)', L: ['2023', '2024', '2025', '2026*'] }
};
const SER = {
  fat: { semana: [1.78, 1.84, 1.88, 1.90, 1.95, 1.96, 2.02, 2.07], mes: [7.2, 6.9, 5.9, 5.6, 6.2, 6.1, 6.4, 6.6, 6.8, 6.9, 7.4, 8.0], ano: [54, 63, 71, 80] },
  prev: { semana: [1.72, 1.76, 1.80, 1.82, 1.82, 1.86, 1.88, 1.94], mes: [7.0, 7.3, 6.2, 5.8, 6.2, 6.3, 6.6, 6.8, 7.0, 7.2, 7.1, 7.5], ano: [52, 61, 70, 77] },
  rec: { semana: [1.70, 1.72, 1.76, 1.82, 1.88, 1.92, 1.95, 1.97], mes: [7.2, 7.3, 6.0, 5.7, 6.3, 6.2, 6.5, 6.7, 6.9, 7.0, 7.0, 7.7], ano: [62.0, 70.8, 76.9, 80.5] },
  pag: { semana: [1.66, 1.68, 1.72, 1.74, 1.74, 1.78, 1.80, 1.78], mes: [6.6, 6.9, 6.2, 6.0, 6.1, 6.0, 6.2, 6.3, 6.4, 6.6, 6.8, 7.1], ano: [58.9, 66.7, 72.4, 77.2] },
  inad: { semana: [2.3, 2.3, 2.4, 2.4, 2.3, 2.3, 2.3, 2.3], mes: [2.0, 2.1, 2.0, 2.2, 2.1, 2.2, 2.3, 2.2, 2.3, 2.4, 2.3, 2.3], ano: [2.2, 2.1, 2.2, 2.3] }
};
const FC = { L: ['Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr'], v: [7.9, 8.1, 6.6, 6.2, 6.8, 6.9] };
const SLAT = [97.2, 97.0, 96.8, 96.5, 96.4, 96.2, 96.0], SCOT = [77.5, 77.8, 78.0, 78.2, 78.1, 78.4, 78.5, 78.6, 78.7, 78.5, 78.7, 78.7];
const FAT12 = sum(SER.fat.mes), REC12 = sum(SER.rec.mes), PAG12 = sum(SER.pag.mes);
const FAT_DELTA = (SER.fat.mes[11] / SER.fat.mes[10] - 1) * 100;
const CLI = sum(SEG.map(s => s.cli)), SCORE = sum(SEG.map(s => s.cli * s.score)) / CLI;
const CUSTO = sum(B.custo), ORC = sum(B.orc);

/* ---------- alertas e ações ---------- */
const ACT = { 'a-cd2': { from: 1, to: 4, pos: 1700, sla: { 1: 2.8 } }, 'a-cd3': { from: 2, to: 3, pos: 400, sla: { 2: 1.1 } } };
const AL = {};
[
  { id: 'a-cd2', sev: 'crit', area: 'Operação', when: 'há 18 min', title: 'CD 2 abaixo da meta de SLA, com ocupação de 97%',
    desc: 'O SLA do CD 2 está em 91,2%, abaixo da meta de 95%, e cai há 4 semanas. Com o pico de outubro e novembro, a tendência é piorar.',
    trend: [94.8, 93.9, 92.6, 91.2], tl: ['S5', 'S6', 'S7', 'S8'], ref: META_SLA, tname: 'SLA do CD 2 (%)',
    rec: { t: 'Mover 1.700 posições do CD 2 para o CD 5', x: 'O CD 5 opera com 28% de ocupação e absorve a carga sem novo investimento.',
      fx: [['CD 2 · ocupação', '97%', '80%'], ['CD 5 · ocupação', '28%', '56%'], ['CD 2 · SLA (estimativa da IA)', '91,2%', '94,0%']],
      cta: 'Aplicar recomendação', conf: 'Confirmar a transferência de 1.700 posições do CD 2 para o CD 5?', done: 'Carga transferida' } },
  { id: 'a-cd3', sev: 'warn', area: 'Operação', when: 'há 1 h', title: 'CD 3 acima do limite operacional de 80%',
    desc: 'A ocupação do CD 3 está em 82% e o SLA em 94,1%, já abaixo da meta de 95%.',
    trend: [95.4, 95.0, 94.5, 94.1], tl: ['S5', 'S6', 'S7', 'S8'], ref: META_SLA, tname: 'SLA do CD 3 (%)',
    rec: { t: 'Mover 400 posições do CD 3 para o CD 4', x: 'O CD 4 opera com 61% de ocupação e SLA de 98,4%.',
      fx: [['CD 3 · ocupação', '82%', '78%'], ['CD 4 · ocupação', '61%', '66%'], ['CD 3 · SLA (estimativa da IA)', '94,1%', '95,2%']],
      cta: 'Aplicar recomendação', conf: 'Confirmar a transferência de 400 posições do CD 3 para o CD 4?', done: 'Carga transferida' } },
  { id: 'a-inad', sev: 'warn', area: 'Financeiro', when: 'há 2 h', title: 'Inadimplência do Marketplace em 3,8%, acima da meta de 3%',
    desc: 'O segmento Marketplace tem 14 clientes e 6 deles estão com atraso acima de 30 dias. A inadimplência global segue em 2,3%, dentro da meta.',
    rec: { t: 'Encaminhar ao Financeiro a revisão de limite de crédito dos 6 clientes em atraso', x: 'A ação não altera os limites: abre a revisão com a lista pronta.',
      fx: null, cta: 'Encaminhar ao Financeiro', conf: 'Encaminhar a lista dos 6 clientes do Marketplace ao Financeiro?', done: 'Encaminhado ao Financeiro' } },
  { id: 'a-fat', sev: 'info', area: 'Financeiro', when: 'há 3 h', title: 'Faturamento de outubro 8,1% acima de setembro',
    desc: 'Outubro fechou em R$ 8,0M contra R$ 7,4M em setembro. Em 12 meses, o faturamento soma R$ 80,0M.', rec: null },
  { id: 'a-custo', sev: 'info', area: 'Financeiro', when: 'há 4 h', title: 'Custo operacional dentro do orçamento',
    desc: 'O custo operacional global do mês é R$ 1,8M, contra um orçamento de R$ 1,9M.', rec: null },
  { id: 'a-tfa', sev: 'info', area: 'Operação', when: 'há 5 h', title: 'TFA global em 1,0%, abaixo da meta de 2%',
    desc: 'A taxa de faltas e avarias está dentro da meta nos 5 centros. Os maiores índices são do CD 2 (1,4%) e do CD 3 (1,1%).', rec: null },
  { id: 'a-cd5', sev: 'info', area: 'Operação', when: 'há 6 h', title: 'CD 5 com 28% de ocupação',
    desc: 'O CD 5 tem espaço ocioso. Ele é o destino da carga recomendada no alerta do CD 2.', rec: null, link: 'a-cd2' }
].forEach(a => { a.st = 'aberto'; AL[a.id] = a; });
const ALIST = Object.keys(AL).map(k => AL[k]);
const SEVN = { crit: 'Crítico', warn: 'Atenção', info: 'Informativo' };
const SEVI = { crit: '▲', warn: '▲', info: 'i' };
const isOpen = a => a.st === 'aberto';
const openBy = s => ALIST.filter(a => isOpen(a) && a.sev === s);
const needAct = () => ALIST.filter(a => isOpen(a) && a.sev !== 'info');
const CDAL = { 1: 'a-cd2', 2: 'a-cd3' };

function occ(i) { let v = B.occ[i]; for (const id in ACT) { if (AL[id].st !== 'resolvido') continue; const a = ACT[id]; if (a.from === i) v -= a.pos / CAP[i] * 100; if (a.to === i) v += a.pos / CAP[i] * 100; } return v; }
function sla(i) { let v = B.sla[i]; for (const id in ACT) { if (AL[id].st === 'resolvido' && ACT[id].sla[i]) v += ACT[id].sla[i]; } return v; }
const wavg = f => sum(CDS.map((_, i) => f(i) * CAP[i])) / sum(CAP);
const slaG = () => wavg(sla), occG = () => wavg(occ);
const occSt = v => v >= 95 ? ['crit', '▲ Crítico'] : v > LIM_OCC ? ['warn', '▲ Acima do limite'] : v < 40 ? ['mut', '○ Ociosa'] : ['ok', '✓ Normal'];
const slaSt = v => v < META_SLA - 3 ? ['crit', '▲ Abaixo da meta'] : v < META_SLA ? ['warn', '▲ Abaixo da meta'] : ['ok', '✓ Na meta'];

/* ---------- estado ---------- */
const S = { auth: false, view: 'estrategico', per: 'mes', atab: 'todos', itab: 'todos', acur: null, mini: false, theme: 'claro', layer: null, opener: null, chatOpen: false, confirm: null, msgs: [], cur: null };
const VIEWS = {
  estrategico: { t: 'Estratégico', per: true }, tatico: { t: 'Tático', per: true }, vendas: { t: 'Vendas', per: false },
  financeiro: { t: 'Financeiro', per: true }, operacao: { t: 'Operação', per: false }, alertas: { t: 'Alertas', per: false }
};
const IC = {
  estrategico: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>', tatico: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  vendas: '<path d="M3 4h2l2.4 11h10.2L20 7H6"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>', financeiro: '<path d="M12 3v18M17 7H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H7"/>',
  operacao: '<path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8"/>', alertas: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10.3 20a2 2 0 0 0 3.4 0"/>',
  col: '<path d="M15 6l-6 6 6 6"/>', chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>'
};
const svgi = k => '<svg viewBox="0 0 24 24" aria-hidden="true">' + IC[k] + '</svg>';

/* ---------- gráficos: SVG medido no tamanho real do card ---------- */
let CH = [];
const chart = (id, fn) => { CH.push({ id: id, fn: fn }); return '<div class="ch" data-chart="' + id + '"></div>'; };
function drawCharts() { $$('[data-chart]').forEach(el => { const c = CH.find(x => x.id === el.dataset.chart); if (!c) return; const w = el.clientWidth || 560, h = el.clientHeight || 240; if (w > 40 && h > 40) el.innerHTML = c.fn(Math.round(w), Math.round(h)); }); }
const nice = m => { const p = Math.pow(10, Math.floor(Math.log10(m))), x = m / p; return (x <= 1 ? 1 : x <= 2 ? 2 : x <= 2.5 ? 2.5 : x <= 5 ? 5 : 10) * p; };
const tk = v => { v = Math.round(v * 100) / 100; return v >= 10 ? nf(v, 0) : nf(v, Math.abs(v % 1) > 0.001 ? (Math.abs(v * 10 % 1) > 0.01 ? 2 : 1) : 0); };
function barsLine(o, W, H) {
  const L = 34, R = 6, T = 20, Bt = 22, n = o.labels.length, ih = H - T - Bt, gw = (W - L - R) / n, bw = Math.min(40, gw * 0.62);
  const mx = nice(Math.max.apply(null, o.bars.concat(o.line || [])) * 1.1);
  const Y = v => T + ih * (1 - v / mx); let g = '';
  for (let i = 0; i <= 4; i++) { const y = T + ih * (1 - i / 4); g += '<line class="gl" x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '"/><text x="' + (L - 6) + '" y="' + (y + 4) + '" text-anchor="end">' + tk(mx * i / 4) + '</text>'; }
  let b = '';
  o.labels.forEach((lb, i) => {
    const cx = L + gw * (i + .5), v = o.bars[i], y = Y(v), h = T + ih - y, last = i === n - 1;
    b += '<text x="' + cx + '" y="' + (H - 6) + '" text-anchor="middle">' + esc(lb) + '</text><rect class="b" x="' + (cx - bw / 2).toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="4" fill="' + (last ? 'var(--accent)' : 'var(--c3)') + '"><title>' + esc(lb + ': ' + o.fmt(v) + (o.line ? ' · previsto ' + o.fmt(o.line[i]) : '')) + '</title></rect>';
    if (n <= 8 || last) b += '<text class="vl" x="' + cx + '" y="' + (y - 5).toFixed(1) + '" text-anchor="middle">' + (o.note ? o.note(i) : o.fmt(v)) + '</text>';
  });
  let ln = '';
  if (o.line) { ln = '<polyline fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="5 4" stroke-linejoin="round" points="' + o.line.map((v, i) => (L + gw * (i + .5)).toFixed(1) + ',' + Y(v).toFixed(1)).join(' ') + '"/>'; o.line.forEach((v, i) => { ln += '<circle cx="' + (L + gw * (i + .5)).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="3" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.5"/>'; }); }
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(o.aria) + '">' + g + b + ln + '</svg>';
}
function linesC(o, W, H) {
  const L = 34, R = 14, T = 16, Bt = 22, n = o.labels.length, ih = H - T - Bt;
  const all = [].concat.apply([], o.series.map(s => s.data)).concat(o.ref ? [o.ref.v] : []).concat(o.band ? o.band.hi.concat(o.band.lo) : []);
  let lo = o.yMin != null ? o.yMin : Math.min.apply(null, all) * 0.94, hi = o.yMax != null ? o.yMax : Math.max.apply(null, all) * 1.04;
  if (o.yMin == null) { const step = nice((hi - lo) / 4); lo = Math.floor(lo / step) * step; hi = lo + step * 4; while (hi < Math.max.apply(null, all)) hi += step; }
  const X = i => L + (W - L - R) * (n === 1 ? .5 : i / (n - 1)), Y = v => T + ih * (1 - (v - lo) / (hi - lo));
  let g = '';
  for (let i = 0; i <= 4; i++) { const v = lo + (hi - lo) * i / 4, y = Y(v); g += '<line class="gl" x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '"/><text x="' + (L - 6) + '" y="' + (y + 4) + '" text-anchor="end">' + (o.ytk ? o.ytk(v) : tk(v)) + '</text>'; }
  o.labels.forEach((lb, i) => { g += '<text x="' + X(i) + '" y="' + (H - 6) + '" text-anchor="middle">' + esc(lb) + '</text>'; });
  let a = '';
  if (o.between) { const A = o.series[0].data, Bb = o.series[1].data; a = '<polygon fill="var(--accent)" opacity=".16" points="' + A.map((v, i) => X(i).toFixed(1) + ',' + Y(v).toFixed(1)).join(' ') + ' ' + Bb.map((v, i) => X(n - 1 - i).toFixed(1) + ',' + Y(Bb[n - 1 - i]).toFixed(1)).join(' ') + '"/>'; }
  if (o.band) a += '<polygon fill="var(--accent)" opacity=".16" points="' + o.band.hi.map((v, i) => X(i).toFixed(1) + ',' + Y(v).toFixed(1)).join(' ') + ' ' + o.band.lo.map((v, i) => X(n - 1 - i).toFixed(1) + ',' + Y(o.band.lo[n - 1 - i]).toFixed(1)).join(' ') + '"/>';
  if (o.ref) g += '<line class="ref" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(o.ref.v) + '" y2="' + Y(o.ref.v) + '"/><text class="reft" x="' + (W - R) + '" y="' + (Y(o.ref.v) - 6) + '" text-anchor="end">' + esc(o.ref.l) + '</text>';
  let p = '';
  o.series.forEach(s => {
    p += '<polyline fill="none" stroke="' + s.color + '" stroke-width="2.5" stroke-linejoin="round"' + (s.dash ? ' stroke-dasharray="6 4"' : '') + ' points="' + s.data.map((v, i) => X(i).toFixed(1) + ',' + Y(v).toFixed(1)).join(' ') + '"/>';
    s.data.forEach((v, i) => { p += '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="3.5" fill="' + s.color + '"><title>' + esc(o.labels[i] + ' · ' + s.name + ': ' + o.fmt(v)) + '</title></circle>'; });
    const li = n - 1; p += '<text class="vl" x="' + X(li) + '" y="' + (Y(s.data[li]) - 9).toFixed(1) + '" text-anchor="end">' + o.fmt(s.data[li]) + '</text>';
  });
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(o.aria) + '">' + g + a + p + '</svg>';
}
function funnelH(W, H) {
  const n = FUNIL.length, T = 22, Bt = 40, ih = H - T - Bt, cw = Math.min(110, (W - 20) / n * .5), gap = (W - cw * n) / (n - 1) || 0, conv = FUNIL.slice(1).map((f, i) => f.v / FUNIL[i].v * 100), worst = conv.indexOf(Math.min.apply(null, conv));
  const hh = v => Math.max(28, ih * v / 100), x = i => i * (cw + gap), yc = T + ih / 2; let s = '';
  FUNIL.forEach((f, i) => {
    const h = hh(f.v), c = i === n - 1 ? 'var(--accent)' : 'var(--c2)';
    if (i < n - 1) { const h2 = hh(FUNIL[i + 1].v), w = i === worst; s += '<polygon fill="' + (w ? 'var(--warn)' : 'var(--c3)') + '" opacity=".22" points="' + (x(i) + cw) + ',' + (yc - h / 2) + ' ' + x(i + 1) + ',' + (yc - h2 / 2) + ' ' + x(i + 1) + ',' + (yc + h2 / 2) + ' ' + (x(i) + cw) + ',' + (yc + h / 2) + '"/><text x="' + (x(i) + cw + gap / 2) + '" y="' + (yc - Math.max(h, h2) / 2 - 6) + '" text-anchor="middle" style="' + (w ? 'fill:var(--warn);font-weight:600' : '') + '">' + (w ? '▲ ' : '') + nf(conv[i], 0) + '% avançam</text>'; }
    s += '<rect class="b" x="' + x(i) + '" y="' + (yc - h / 2) + '" width="' + cw + '" height="' + h + '" rx="6" fill="' + c + '"><title>' + esc(f.l + ': ' + f.v + ' ' + f.u) + '</title></rect><text x="' + (x(i) + cw / 2) + '" y="' + (yc + 5) + '" text-anchor="middle" style="fill:' + (i === n - 1 ? 'var(--onAccent)' : 'var(--surface)') + ';font-size:15px;font-weight:600">' + f.v + '</text><text x="' + (x(i) + cw / 2) + '" y="' + (H - 18) + '" text-anchor="middle" style="fill:var(--ink);font-weight:500;font-size:12px">' + f.l + '</text><text x="' + (x(i) + cw / 2) + '" y="' + (H - 4) + '" text-anchor="middle">' + f.u + '</text>';
  });
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc('Funil: ' + FUNIL.map(f => f.l + ' ' + f.v).join(', ') + '.') + '">' + s + '</svg>';
}
const sl = (vals, col) => { const mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), r = mx - mn || 1; return '<svg class="sp" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true"><polyline fill="none" stroke="' + (col || 'var(--accent)') + '" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" points="' + vals.map((v, i) => (i / (vals.length - 1) * 100).toFixed(1) + ',' + (25 - (v - mn) / r * 22).toFixed(1)).join(' ') + '"/></svg>'; };
const PAL = ['var(--accent)', 'var(--info)', 'var(--c2)', 'var(--c3)'];
function donut(segs, center, sub, aria) {
  const tot = sum(segs.map(s => s.v)), r = 52, C = 2 * Math.PI * r; let off = 0, a = '';
  segs.forEach((s, i) => { const d = s.v / tot * C; a += '<circle cx="75" cy="75" r="' + r + '" fill="none" stroke="' + PAL[i % 4] + '" stroke-width="20" stroke-dasharray="' + Math.max(d - 2, 0.5).toFixed(2) + ' ' + C.toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 75 75)"><title>' + esc(s.l + ': ' + (s.t || s.v)) + '</title></circle>'; off += d; });
  const leg = segs.map((s, i) => '<div><i style="background:' + PAL[i % 4] + '"></i><span>' + esc(s.l) + (s.sub ? '<br><small>' + s.sub + '</small>' : '') + '</span><span class="p num">' + esc(s.t || pct(s.v / tot * 100, 0)) + '</span></div>').join('');
  return '<div class="dn"><svg viewBox="0 0 150 150" role="img" aria-label="' + esc(aria) + '">' + a + '<text class="ctr" x="75" y="77" text-anchor="middle">' + esc(center) + '</text><text class="cts" x="75" y="92" text-anchor="middle">' + esc(sub) + '</text></svg><div class="dl">' + leg + '</div></div>';
}
function hb(rows) { return '<div class="hb">' + rows.map(r => '<div class="hr"><span class="n">' + esc(r.n) + '</span><div class="tr" role="img" aria-label="' + esc(r.a || r.n) + '"><div class="fl ' + (r.c || '') + '" style="width:' + Math.max(0, Math.min(100, r.w)).toFixed(1) + '%"></div>' + (r.m != null ? '<span class="mk" style="left:' + r.m + '%"></span>' : '') + '</div><span class="vv num">' + r.v + '</span></div>').join('') + '</div>'; }
function spark(vals, labels, ref, name) {
  const W = 420, H = 130, L = 36, R = 14, T = 14, Bt = 24, lo = Math.floor(Math.min.apply(null, vals.concat([ref])) - 1), hi = Math.ceil(Math.max.apply(null, vals.concat([ref])) + 1), ih = H - T - Bt;
  const X = i => L + (W - L - R) * i / (vals.length - 1), Y = v => T + ih * (1 - (v - lo) / (hi - lo));
  let s = '<line class="ref" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(ref) + '" y2="' + Y(ref) + '"/><text class="reft" x="' + (W - R) + '" y="' + (Y(ref) - 5) + '" text-anchor="end">meta ' + ref + '%</text>';
  s += '<polyline fill="none" stroke="var(--crit)" stroke-width="2.5" points="' + vals.map((v, i) => X(i) + ',' + Y(v)).join(' ') + '"/>';
  vals.forEach((v, i) => { s += '<circle cx="' + X(i) + '" cy="' + Y(v) + '" r="3.5" fill="var(--crit)"/><text class="vl" x="' + X(i) + '" y="' + (Y(v) + 16) + '" text-anchor="middle">' + nf(v, 1) + '</text><text x="' + X(i) + '" y="' + (H - 6) + '" text-anchor="middle">' + labels[i] + '</text>'; });
  return '<div class="ch" style="min-height:0;height:130px;flex:none"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(name + ': ' + vals.map(v => nf(v, 1)).join(', ') + '. Meta ' + ref + '%.') + '">' + s + '</svg></div>';
}
function ring(v, c) {
  const r = 32, C = 2 * Math.PI * r, a = -Math.PI / 2 + LIM_OCC / 100 * 2 * Math.PI, col = c === 'crit' ? 'var(--crit)' : c === 'warn' ? 'var(--warn)' : c === 'mut' ? 'var(--c2)' : 'var(--accent)';
  return '<svg class="ring" viewBox="0 0 80 80" role="img" aria-label="Ocupação ' + nf(v, 0) + '%, limite 80%"><circle cx="40" cy="40" r="' + r + '" fill="none" stroke="var(--s2)" stroke-width="9"/><circle cx="40" cy="40" r="' + r + '" fill="none" stroke="' + col + '" stroke-width="9" stroke-linecap="round" stroke-dasharray="' + (Math.min(v, 100) / 100 * C).toFixed(1) + ' ' + C.toFixed(1) + '" transform="rotate(-90 40 40)"/><line x1="' + (40 + 27 * Math.cos(a)).toFixed(1) + '" y1="' + (40 + 27 * Math.sin(a)).toFixed(1) + '" x2="' + (40 + 37 * Math.cos(a)).toFixed(1) + '" y2="' + (40 + 37 * Math.sin(a)).toFixed(1) + '" stroke="var(--ink)" stroke-width="2"/><text class="rt" x="40" y="42" text-anchor="middle">' + nf(v, 0) + '%</text><text class="rs" x="40" y="53" text-anchor="middle">ocupação</text></svg>';
}

/* ---------- blocos ---------- */
let cid = 0;
const st = (c, t) => '<span class="st ' + c + '">' + esc(t) + '</span>';
const card = o => { const id = 'c' + (++cid); return '<section class="card" style="--s:' + o.s + ';--t:' + (o.t || 60) + '" aria-labelledby="' + id + '"><div class="hd"><div><h2 id="' + id + '">' + esc(o.title) + '</h2>' + (o.sub ? '<p class="cs">' + esc(o.sub) + '</p>' : '') + '</div>' + (o.right || '') + '</div><div class="cb">' + o.body + '</div></section>'; };
const kpi = (s, t, l, v, d, tag, vals, col) => '<div class="kpi" style="--s:' + s + ';--t:' + t + ';--m:30"><div class="kh"><span class="l">' + esc(l) + '</span>' + (tag ? st(tag[0], tag[1]) : '') + '</div><div class="v num">' + v + '</div><div class="d">' + d + '</div>' + (vals ? sl(vals, col) : '') + '</div>';
const page = (t, sub, rows, inner) => '<div class="ph"><h1 id="h1" tabindex="-1">' + esc(t) + '</h1><p class="sub">' + esc(sub) + '</p></div><div class="dash" style="--rows:' + rows + '">' + inner + '</div>';
const lgd = l => '<div class="lg">' + l.join('') + '</div>';

function decisions() {
  const l = needAct();
  if (!l.length) return '<div class="dc none" style="--s:60"><b class="tx-ok" style="font-size:1.3rem">✓</b><div><div class="t">Nada exige sua decisão agora</div><div class="r">Os alertas críticos e de atenção foram tratados.</div></div></div>';
  const sp = l.length === 1 ? 60 : l.length === 2 ? 30 : 20;
  return l.map(a => '<div class="dc ' + a.sev + '" style="--s:' + sp + ';--t:' + (l.length === 1 ? 60 : 30) + '"><div>' + st(a.sev, SEVI[a.sev] + ' ' + SEVN[a.sev]) + '</div><div class="t">' + esc(a.title) + '</div>' + (a.rec ? '<div class="r"><b>IA recomenda:</b> ' + esc(a.rec.t) + '.</div>' : '') + '<div class="ft"><span>' + a.area + ' · ' + a.when + '</span><button class="btn pri sm" data-alert="' + a.id + '">Ver recomendação</button></div></div>').join('');
}

/* ---------- telas ---------- */
function cashChart(id, p) { return chart(id, (w, h) => linesC({ labels: PER[p].L, series: [{ name: 'A receber', color: 'var(--accent)', data: SER.rec[p] }, { name: 'A pagar', color: 'var(--c2)', data: SER.pag[p], dash: true }], between: true, fmt: v => nf(v, 1), aria: 'Fluxo de caixa, a receber e a pagar, em R$ milhões. A área entre as linhas é o saldo.' }, w, h)) + lgd(['<span><i style="background:var(--accent)"></i>A receber</span>', '<span><i style="background:var(--c2)"></i>A pagar</span>', '<span><i style="background:var(--accent);opacity:.3"></i>Saldo</span>']); }
function vEstrategico() {
  const p = S.per, g = slaG(), slaSer = SLAT.concat([g]), below = CDS.filter((_, i) => sla(i) < META_SLA);
  const saldo = SER.rec.mes.map((v, i) => v - SER.pag.mes[i]);
  return page('Visão estratégica', 'A saúde do negócio nos 5 centros de distribuição.', 'auto auto minmax(0,1fr)',
    decisions() +
    kpi(12, 30, 'Faturamento, 12 meses', money(FAT12), 'vs. setembro no mês', ['ok', '▲ ' + pct(FAT_DELTA)], SER.fat.mes) +
    kpi(12, 30, 'Resultado de caixa, 12 meses', '+' + money(REC12 - PAG12), 'Receber ' + money(REC12) + ' · Pagar ' + money(PAG12), null, saldo) +
    kpi(12, 20, 'SLA global', pct(g), 'meta ' + META_SLA + '%' + (below.length ? ' · ' + below.join(', ') + ' abaixo' : ''), g >= META_SLA ? ['ok', '✓ Na meta'] : ['crit', '▲ Abaixo'], slaSer, g >= META_SLA ? 'var(--accent)' : 'var(--crit)') +
    kpi(12, 20, 'Inadimplência global', pct(SER.inad.mes[11]), 'meta abaixo de ' + META_INAD + '%', ['ok', '✓ Na meta'], SER.inad.mes) +
    kpi(12, 20, 'Score médio da carteira', nf(SCORE, 0), CLI + ' clientes ativos · 0 a 100', null, SCOT) +
    card({ s: 25, t: 60, title: 'Faturamento', sub: PER[p].d + ' · R$ milhões', body: chart('fat', (w, h) => barsLine({ labels: PER[p].L, bars: SER.fat[p], line: SER.prev[p], fmt: v => nf(v, 1), aria: 'Faturamento realizado em R$ milhões e previsto: ' + SER.fat[p].map(v => nf(v, 1)).join(', ') }, w, h)) + lgd(['<span><i style="background:var(--c3)"></i>Realizado</span>', '<span><i style="background:var(--accent)"></i>Período atual</span>', '<span><span class="mkl"></span>Previsto</span>']) }) +
    card({ s: 15, t: 30, title: 'Faturamento por CD', sub: '12 meses · participação', body: hb(CDS.map((c, i) => ({ n: c, w: B.fat[i] / 30 * 100, v: money(B.fat[i]) + ' <span style="color:var(--ink3)">' + pct(B.fat[i] / 80 * 100, 0) + '</span>', c: 'ok', a: c + ': ' + money(B.fat[i]) }))) }) +
    card({ s: 20, t: 30, title: 'Fluxo de caixa', sub: 'A receber e a pagar · R$ milhões', body: cashChart('cx1', p) }));
}
function vTatico() {
  const p = S.per, ttcT = sum(TTC.map(t => t.v)), dv = CDS.map((_, i) => occ(i) - B.prev[i]), ab = dv.map(Math.abs), wi = ab.indexOf(Math.max.apply(null, ab));
  const rp = SER.fat.mes[11] / SER.prev.mes[11] * 100 - 100, lenta = TTC[3].v / ttcT * 100, diff = SER.fat[p].map((v, i) => (v / SER.prev[p][i] - 1) * 100), mx = 15;
  return page('Visão tática', 'O que foi previsto, o que aconteceu e onde a divergência pede ajuste.', 'auto minmax(0,1fr) minmax(0,1fr)',
    kpi(15, 30, 'Recebe só em até 90 dias', pct(lenta, 0), TTC[3].v + ' de ' + ttcT + ' clientes', ['warn', '▲ Atenção']) +
    kpi(15, 30, 'Maior divergência de ocupação', (dv[wi] > 0 ? '+' : '−') + nf(Math.abs(dv[wi]), 0) + ' p.p.', CDS[wi] + ' vs. previsto', [ab[wi] > 10 ? 'warn' : 'ok', ab[wi] > 10 ? '▲ Atenção' : '✓ Alinhado']) +
    kpi(15, 30, 'Faturamento: real ÷ previsto', (rp >= 0 ? '+' : '') + pct(rp), 'outubro · ' + money(SER.fat.mes[11]) + ' vs. ' + money(SER.prev.mes[11]), ['ok', '✓ Acima']) +
    kpi(15, 30, 'Previsão de recebimento', money(FC.v[0]), 'próximo mês · novembro', null, FC.v) +
    card({ s: 35, t: 60, title: 'Faturamento: previsto × realizado', sub: PER[p].d + ' · R$ milhões · % = diferença', body: chart('pr', (w, h) => barsLine({ labels: PER[p].L, bars: SER.fat[p], line: SER.prev[p], note: i => (diff[i] >= 0 ? '+' : '') + nf(diff[i], 1) + '%', fmt: v => nf(v, 1), aria: 'Faturamento realizado e previsto em R$ milhões. Diferenças: ' + diff.map(d => nf(d, 1) + '%').join(', ') }, w, h)) + lgd(['<span><i style="background:var(--c3)"></i>Realizado</span>', '<span><span class="mkl"></span>Previsto</span>']) }) +
    card({ s: 25, t: 60, title: 'Divergência de ocupação', sub: 'Realizada menos prevista, por CD', body: '<div class="dv">' + CDS.map((c, i) => { const w = Math.min(ab[i] / mx * 50, 50), cl = ab[i] < 3 ? 'ok' : ''; return '<div class="dvr"><b>' + c + '</b><div class="dvt" role="img" aria-label="' + c + ': ' + (dv[i] > 0 ? '+' : '') + nf(dv[i], 0) + ' pontos percentuais"><i class="' + (dv[i] >= 0 ? 'pos' : 'neg') + ' ' + cl + '" style="width:' + w + '%"></i></div><span class="num">' + (dv[i] > 0 ? '+' : dv[i] < 0 ? '−' : '') + nf(Math.abs(dv[i]), 0) + ' p.p. ' + (ab[i] < 3 ? st('ok', '✓') : dv[i] > 0 ? st('warn', '▲') : st('info', '▼')) + '</span></div>'; }).join('') + '</div>' + lgd(['<span><i style="background:var(--info)"></i>Abaixo do previsto</span>', '<span><i style="background:var(--warn)"></i>Acima</span>', '<span><i style="background:var(--accent)"></i>Alinhado (até 3 p.p.)</span>']) }) +
    card({ s: 25, t: 60, title: 'Prazo de recebimento', sub: 'Clientes por prazo previsto', body: '<div class="big num">' + ttcT + ' <span style="font-size:.88rem;font-weight:400;color:var(--ink3)">clientes ativos</span></div><div class="stk" role="img" aria-label="' + TTC.map(t => t.l + ': ' + t.v).join(', ') + '" style="height:18px;border-radius:9px">' + TTC.map((t, i) => '<span style="width:' + t.v / ttcT * 100 + '%;background:' + PAL[i] + '"></span>').join('') + '</div><div class="seg2">' + TTC.map((t, i) => '<div><span><i style="background:' + PAL[i] + '"></i>' + t.l + '</span><b class="num">' + t.v + '</b><span>' + pct(t.v / ttcT * 100, 0) + '</span></div>').join('') + '</div><p style="font-size:.84rem">' + st('warn', '▲ Atenção') + ' Metade da carteira só recebe em até 90 dias.</p>' }) +
    card({ s: 35, t: 60, title: 'Previsão de recebimento', sub: 'Próximos 6 meses · R$ milhões · faixa = incerteza de 8%', body: chart('fc', (w, h) => linesC({ labels: FC.L, series: [{ name: 'Previsão', color: 'var(--accent)', data: FC.v }], band: { hi: FC.v.map(v => v * 1.08), lo: FC.v.map(v => v * 0.92) }, fmt: v => nf(v, 1), aria: 'Previsão de recebimento para os próximos 6 meses: ' + FC.v.map(v => nf(v, 1)).join(', ') + ' milhões, com faixa de 8%.' }, w, h)) }));
}
function vVendas() {
  const conv = FUNIL.slice(1).map((f, i) => f.v / FUNIL[i].v * 100), worst = conv.indexOf(Math.min.apply(null, conv));
  return page('Operacional · Vendas', 'Do primeiro contato ao cliente ativo: onde o funil mais perde.', 'auto minmax(0,1fr)',
    kpi(20, 20, 'Conversão geral', pct(FUNIL[3].v / FUNIL[0].v * 100, 0), FUNIL[0].v + ' leads → ' + FUNIL[3].v + ' clientes') +
    kpi(20, 20, 'Maior perda', pct(100 - conv[worst], 0), FUNIL[worst].l + ' → ' + FUNIL[worst + 1].l, ['warn', '▲ Atenção']) +
    kpi(20, 20, 'Clientes ativos', String(CLI), '4 segmentos · score médio ' + nf(SCORE, 0)) +
    card({ s: 35, t: 60, title: 'Funil de conversão', sub: 'Leads por etapa e % que avança', body: chart('fn', funnelH) }) +
    card({ s: 25, t: 60, title: 'Clientes por segmento', sub: 'Distribuição e score médio', body: donut(SEG.map(s => ({ l: s.n, v: s.cli, t: s.cli + ' · ' + pct(s.cli / CLI * 100, 0), sub: 'score ' + s.score })), String(CLI), 'clientes', 'Clientes por segmento: ' + SEG.map(s => s.n + ' ' + s.cli + ', score ' + s.score).join('; ')) }));
}
function vFinanceiro() {
  const p = S.per, saldo = SER.rec.mes.map((v, i) => v - SER.pag.mes[i]);
  return page('Operacional · Financeiro', 'Caixa, inadimplência e custo, com as metas à vista.', 'auto minmax(0,1fr) minmax(0,1fr)',
    kpi(20, 20, 'Resultado de caixa, 12 meses', '+' + money(REC12 - PAG12), 'Receber ' + money(REC12) + ' · Pagar ' + money(PAG12), null, saldo) +
    kpi(20, 20, 'Inadimplência global', pct(SER.inad.mes[11]), 'meta abaixo de ' + META_INAD + '% · Marketplace em 3,8%', ['ok', '✓ Na meta'], SER.inad.mes) +
    kpi(20, 20, 'Custo do mês × orçamento', money(CUSTO), 'orçamento ' + money(ORC) + ' · ' + pct(CUSTO / ORC * 100, 0) + ' usado', ['ok', '✓ Dentro']) +
    card({ s: 35, t: 60, title: 'Fluxo de caixa', sub: PER[p].d + ' · R$ milhões', body: cashChart('cx2', p) }) +
    card({ s: 25, t: 60, title: 'Faturamento por segmento', sub: '12 meses', body: donut(SEG.map(s => ({ l: s.n, v: s.fat })), money(FAT12), '12 meses', 'Faturamento por segmento: ' + SEG.map(s => s.n + ' ' + s.fat + '%').join(', ')) }) +
    card({ s: 25, t: 60, title: 'Inadimplência', sub: PER[p].d + ' · % da carteira', body: '<div class="chips">' + SEG.map(s => '<span class="chip' + (s.inad > META_INAD ? ' bad' : '') + '">' + s.n + ' ' + pct(s.inad) + (s.inad > META_INAD ? ' ▲' : '') + '</span>').join('') + '</div>' + chart('in', (w, h) => linesC({ labels: PER[p].L, series: [{ name: 'Inadimplência', color: 'var(--accent)', data: SER.inad[p] }], yMin: 0, yMax: 4, ref: { v: META_INAD, l: 'Meta: 3%' }, fmt: v => nf(v, 1) + '%', ytk: v => nf(v, 0) + '%', aria: 'Inadimplência global em %, meta 3%.' }, w, h)) }) +
    card({ s: 35, t: 60, title: 'Custo por CD', sub: 'No mês · marcador = orçamento de cada CD', body: hb(CDS.map((c, i) => ({ n: c, w: B.custo[i] / (B.orc[i] * 1.25) * 100, m: 80, c: B.custo[i] <= B.orc[i] ? 'ok' : 'crit', v: 'R$ ' + nf(B.custo[i] * 1000, 0) + ' mil <span style="color:var(--ink3)">de ' + nf(B.orc[i] * 1000, 0) + '</span>', a: c + ' R$ ' + nf(B.custo[i] * 1000, 0) + ' mil de orçamento ' + nf(B.orc[i] * 1000, 0) + ' mil' }))) + lgd(['<span><span class="mkl"></span>Orçamento</span>']) }));
}
function vOperacao() {
  const cmx = Math.max.apply(null, [].concat.apply([], B.cmc));
  const fichas = CDS.map((n, i) => {
    const o = occ(i), os = occSt(o), s = sla(i), ss = slaSt(s), tf = B.tfa[i], al = CDAL[i] && isOpen(AL[CDAL[i]]) ? CDAL[i] : null;
    return '<section class="card fc" style="--s:12;--t:20;--m:30" aria-label="' + n + '"><div class="nm">' + n + ' ' + st(os[0], os[1]) + '</div>' + ring(o, os[0]) + '<div class="rg"><div><span>SLA</span><b class="num ' + (ss[0] === 'ok' ? 'tx-ok' : ss[0] === 'crit' ? 'tx-crit' : 'tx-warn') + '">' + pct(s) + ' ' + (ss[0] === 'ok' ? '✓' : '▲') + '</b></div><div><span>TFA</span><b class="num ' + (tf <= META_TFA ? 'tx-ok' : 'tx-crit') + '">' + pct(tf) + ' ✓</b></div><div><span>Capacidade</span><b class="num">' + nf(CAP[i], 0) + ' pos.</b></div></div>' + (al ? '<button class="btn sm" data-alert="' + al + '">Ver alerta</button>' : '<span class="cs">Sem alertas abertos</span>') + '</section>';
  }).join('');
  return page('Operacional · Operação', 'Limite de ocupação 80% · meta de SLA 95% · meta de TFA 2%.', 'minmax(210px,auto) minmax(0,1fr)',
    fichas +
    card({ s: 30, t: 60, title: 'Capacidade de movimentação (CMC)', sub: 'Volumes por hora-homem · CD × turno', body: '<table class="hm"><thead><tr><th scope="col">CD</th><th scope="col">Turno 1</th><th scope="col">Turno 2</th><th scope="col">Turno 3</th></tr></thead><tbody>' + CDS.map((c, i) => '<tr><td class="rowh">' + c + '</td>' + B.cmc[i].map(v => '<td class="num" style="background:color-mix(in srgb,var(--accent) ' + Math.round(8 + v / cmx * 32) + '%,transparent)">' + v + '</td>').join('') + '</tr>').join('') + '</tbody></table>' }) +
    card({ s: 30, t: 60, title: 'Pedidos prontos para operar', sub: 'Por horizonte de entrega', body: '<div class="hb">' + B.pronto.map(r => { const tot = r.p + r.q + r.n; return '<div><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;font-size:.84rem;margin-bottom:5px"><b>' + r.h + '</b><span class="num">' + r.p + ' de ' + tot + ' prontos (' + pct(r.p / tot * 100, 0) + ')</span></div><div class="stk" role="img" aria-label="' + r.h + ': ' + r.p + ' prontos, ' + r.q + ' pendentes, ' + r.n + ' não prontos"><span style="width:' + r.p / tot * 100 + '%;background:var(--ok)"></span><span style="width:' + r.q / tot * 100 + '%;background:var(--warn)"></span><span style="width:' + r.n / tot * 100 + '%;background:var(--crit)"></span></div></div>'; }).join('') + '</div>' + lgd(['<span><i style="background:var(--ok)"></i>Prontos</span>', '<span><i style="background:var(--warn)"></i>Pendentes</span>', '<span><i style="background:var(--crit)"></i>Não prontos</span>']) }));
}
function alertRow(a, cur) {
  const done = !isOpen(a), lbl = { resolvido: 'Resolvido', lido: 'Lido', encaminhado: 'Encaminhado', dispensado: 'Dispensado', adiado: 'Adiado por 4 h' }[a.st];
  return '<button class="al ' + a.sev + (done ? ' done' : '') + '" data-alert="' + a.id + '"' + (cur ? ' aria-current="true"' : '') + '><span class="tt">' + st(a.sev, SEVI[a.sev] + ' ' + SEVN[a.sev]) + (done ? ' ' + st('mut', '✓ ' + lbl) : '') + '<b>' + esc(a.title) + '</b>' + (a.rec && !done ? '<p>IA recomenda: ' + esc(a.rec.t) + '.</p>' : '') + '<span class="mt">' + a.area + ' · ' + a.when + '</span></span></button>';
}
function vAlertas() {
  const tabs = [['todos', 'Abertos', ALIST.filter(isOpen).length], ['crit', 'Críticos', openBy('crit').length], ['warn', 'Atenção', openBy('warn').length], ['info', 'Info', openBy('info').length], ['tratados', 'Tratados', ALIST.filter(a => !isOpen(a)).length]];
  const list = ALIST.filter(a => S.atab === 'todos' ? isOpen(a) : S.atab === 'tratados' ? !isOpen(a) : isOpen(a) && a.sev === S.atab);
  const emp = { todos: ['✓ Nenhum alerta aberto', 'Tudo foi tratado.'], crit: ['✓ Nenhum alerta crítico', 'Nenhum indicador está em nível crítico agora.'], warn: ['✓ Nenhum alerta de atenção', 'Nenhum indicador pede atenção agora.'], info: ['Nenhum alerta informativo aberto', ''], tratados: ['Nada tratado ainda', 'Os alertas que você resolver, adiar ou marcar como lidos aparecem aqui.'] }[S.atab];
  const w = wide(), cur = w ? (AL[S.acur] && list.indexOf(AL[S.acur]) >= 0 ? AL[S.acur] : list[0]) : null;
  const sumr = '<div class="sumr" style="--s:60">' + [['crit', 'Críticos'], ['warn', 'Atenção'], ['info', 'Informativos']].map(k => '<div class="kpi"><div class="kh"><span class="l">' + k[1] + '</span>' + st(k[0], SEVI[k[0]] + ' ' + SEVN[k[0]]) + '</div><div class="v num">' + openBy(k[0]).length + '</div></div>').join('') + '</div>';
  const left = '<section class="card" style="--s:' + (w ? 24 : 60) + ';--t:60" aria-label="Lista de alertas"><div class="tabs" role="tablist" aria-label="Filtrar alertas">' + tabs.map(t => '<button role="tab" id="tab-' + t[0] + '" aria-selected="' + (S.atab === t[0]) + '" data-tab="' + t[0] + '">' + t[1] + ' (' + t[2] + ')</button>').join('') + '</div><div class="list" role="tabpanel" aria-labelledby="tab-' + S.atab + '">' + (list.length ? list.map(a => alertRow(a, cur && cur.id === a.id)).join('') : '<div class="empty"><b>' + emp[0] + '</b>' + emp[1] + '</div>') + '</div></section>';
  const right = w ? '<section class="card" style="--s:36" aria-label="Detalhe do alerta">' + (cur ? '<div class="dt">' + detailInner(cur, true) + '</div>' : '<div class="empty"><b>Nenhum alerta selecionado</b>Escolha um alerta na lista.</div>') + '</section>' : '';
  return page('Central de alertas', 'Cada aviso chega com a causa e a ação recomendada.', 'auto minmax(0,1fr)', sumr + left + right);
}
const RENDER = { estrategico: vEstrategico, tatico: vTatico, vendas: vVendas, financeiro: vFinanceiro, operacao: vOperacao, alertas: vAlertas };

/* ---------- casca ---------- */
function renderSide() {
  const nv = k => '<button class="nv" data-go="' + k + '"' + (S.view === k ? ' aria-current="page"' : '') + ' title="' + VIEWS[k].t + '">' + svgi(k) + '<span class="lb">' + VIEWS[k].t + '</span>' + (k === 'alertas' && needAct().length ? '<span class="cnt" aria-label="' + needAct().length + ' abertos">' + needAct().length + '</span>' : '') + '</button>';
  $('#side').innerHTML = nv('estrategico') + nv('tatico') + '<div class="grp">Operacional</div>' + nv('vendas') + nv('financeiro') + nv('operacao') + '<div class="grp">Monitoramento</div>' + nv('alertas') +
    '<div class="col"><button class="nv" id="colb" aria-label="' + (S.mini ? 'Expandir menu' : 'Recolher menu') + '" title="' + (S.mini ? 'Expandir menu' : 'Recolher menu') + '">' + svgi('col') + '<span class="lb">Recolher menu</span></button></div>';
  $('#shell').classList.toggle('mini', S.mini);
}
function renderChrome() {
  renderSide();
  const n = needAct().length, b = $('#bbadge'); b.hidden = !n; b.textContent = n; $('#bell').setAttribute('aria-label', n ? n + ' alertas pedem atenção' : 'Nenhum alerta pede atenção');
  const v = VIEWS[S.view], per = $('#per'); per.hidden = !v.per;
  if (v.per) { $('.seg', per).innerHTML = Object.keys(PER).map(k => '<button data-period="' + k + '" aria-pressed="' + (S.per === k) + '">' + PER[k].n + '</button>').join(''); $('#perd').textContent = PER[S.per].d; }
}
function render(focus) {
  cid = 0; CH = []; $('#view').innerHTML = RENDER[S.view](); renderChrome(); drawCharts();
  if (focus) { const h = $('#h1'); if (h) h.focus({ preventScroll: true }); $('#main').scrollTop = 0; $('#live').textContent = VIEWS[S.view].t; }
}
let rz = null;
function watch() { if (rz || !window.ResizeObserver) return; let q = 0; rz = new ResizeObserver(() => { cancelAnimationFrame(q); q = requestAnimationFrame(drawCharts); }); rz.observe($('#main')); }
function go(v, push) { if (!VIEWS[v]) v = 'estrategico'; S.view = v; closePop(); $('#shell').classList.remove('open'); $('#scrim').classList.remove('on'); $('#burger').setAttribute('aria-expanded', 'false'); if (push !== false && location.hash !== '#/' + v) { try { history.replaceState(null, '', '#/' + v); } catch (e) { } } render(true); }
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 3200); }
function setTheme(t) { S.theme = t; document.documentElement.setAttribute('data-theme', t); }
function closePop() { const p = $('#pop'); if (!p.hidden) { p.hidden = true; $$('[aria-expanded="true"]', $('.top')).forEach(b => b.setAttribute('aria-expanded', 'false')); } }
function openPop(kind, btn) {
  const p = $('#pop'); if (!p.hidden && p.dataset.k === kind) { closePop(); btn.focus(); return; }
  closePop(); p.dataset.k = kind;
  if (kind === 'bell') {
    const l = needAct();
    p.innerHTML = '<div class="ph2">Alertas que pedem atenção</div>' + (l.length ? l.map(a => '<button class="it" data-alert="' + a.id + '"><b>' + esc(a.title) + '</b><small>' + SEVN[a.sev] + ' · ' + a.area + ' · ' + a.when + '</small></button>').join('') : '<div class="empty" style="padding:16px"><b>✓ Nada pendente</b></div>') + '<hr><button class="it" data-go="alertas"><b>Abrir a central de alertas</b></button>';
  } else {
    p.innerHTML = '<div class="ph2">Gerente de operações<small style="display:block;font-weight:400;color:var(--ink3)">Demonstração · dados fictícios</small></div><div class="th"><span>Tema</span><div class="seg" role="group" aria-label="Tema">' + [['claro', 'Claro'], ['escuro', 'Escuro']].map(t => '<button data-theme-set="' + t[0] + '" aria-pressed="' + (S.theme === t[0]) + '">' + t[1] + '</button>').join('') + '</div></div><hr><button class="it" data-act="reset"><b>Reiniciar demonstração</b><small>Volta os alertas ao estado inicial</small></button><button class="it" data-act="logout"><b>Sair</b></button>';
  }
  p.hidden = false; btn.setAttribute('aria-expanded', 'true'); const f = $('button', p); if (f) f.focus();
}

/* ---------- detalhe do alerta: ao lado da lista (telas largas) ou em painel ---------- */
function fxTable(a) { return a.rec.fx ? '<div class="ba" role="table" aria-label="Efeito estimado"><span class="h" role="columnheader">Indicador</span><span class="h" role="columnheader">Antes</span><span class="h" role="columnheader"></span><span class="h" role="columnheader">Depois</span>' + a.rec.fx.map(r => '<span role="cell">' + r[0] + '</span><span class="num" role="cell">' + r[1] + '</span><span role="cell" aria-hidden="true">→</span><b class="num" role="cell">' + r[2] + '</b>').join('') + '</div>' : ''; }
function detailInner(a, inline) {
  const open = isOpen(a), cf = S.confirm === a.id; let foot = '';
  if (open && a.rec) foot = cf ? '' : '<button class="btn pri" data-act="ask" data-id="' + a.id + '">' + a.rec.cta + '</button><button class="btn" data-act="snooze" data-id="' + a.id + '">Adiar 4 h</button><button class="btn ghost" data-act="dismiss" data-id="' + a.id + '">Dispensar</button>';
  else if (open) foot = '<button class="btn pri" data-act="read" data-id="' + a.id + '">Marcar como lido</button>';
  const lbl = { resolvido: a.rec && a.rec.done, lido: 'Marcado como lido', encaminhado: a.rec && a.rec.done, dispensado: 'Dispensado', adiado: 'Adiado por 4 h' }[a.st];
  const head = '<div>' + st(a.sev, SEVI[a.sev] + ' ' + SEVN[a.sev]) + '<h2 id="dwt" tabindex="-1" style="outline:none">' + esc(a.title) + '</h2><p class="cs">' + a.area + ' · ' + a.when + '</p></div>';
  const body = (!open ? '<div class="dn2"><span><b>✓ ' + esc(lbl) + (a.at ? ' às ' + a.at : '') + '</b></span>' + (a.st !== 'lido' ? '<button class="btn sm" data-act="undo" data-id="' + a.id + '">Desfazer</button>' : '') + '</div>' : '') +
    '<div class="blk"><h3>O que está acontecendo</h3><p>' + esc(a.desc) + '</p>' + (a.trend ? spark(a.trend, a.tl, a.ref, a.tname) : '') + '</div>' +
    (a.rec ? '<div class="blk"><h3>Recomendação da IA</h3><div class="recbox"><b>' + esc(a.rec.t) + '</b><span>' + esc(a.rec.x) + '</span>' + fxTable(a) + '</div></div>' : '') +
    (a.link && open ? '<div class="blk"><button class="btn" data-alert="' + a.link + '">Abrir o alerta do CD 2</button></div>' : '') +
    (cf ? '<div class="cf" role="group" aria-label="Confirmação"><b>' + esc(a.rec.conf) + '</b><p style="margin:6px 0 12px;font-size:.9rem">A ação pode ser desfeita em seguida.</p><div style="display:flex;gap:10px"><button class="btn pri" data-act="apply" data-id="' + a.id + '">Confirmar</button><button class="btn" data-act="cancel">Cancelar</button></div></div>' : '');
  if (inline) return head + body + (foot ? '<div class="df">' + foot + '</div>' : '');
  return '<div class="dh">' + head + '<button class="ibtn" data-close aria-label="Fechar">✕</button></div><div class="db">' + body + '</div>' + (foot ? '<div class="df">' + foot + '</div>' : '');
}
const drawerHTML = a => '<aside class="dw" role="dialog" aria-modal="true" aria-labelledby="dwt">' + detailInner(a, false) + '</aside>';
function openLayer(html, mid, opener) { S.opener = opener || document.activeElement; const l = $('#layer'); l.innerHTML = '<div class="ov' + (mid ? ' mid' : '') + '" id="ov">' + html + '</div>'; S.layer = true; const f = $('[data-close]', l) || $('button', l); if (f) f.focus(); }
function closeLayer() { if (!S.layer) return; $('#layer').innerHTML = ''; S.layer = null; S.confirm = null; const o = S.opener; if (o && document.contains(o)) o.focus(); }
function openAlert(id, opener) { S.confirm = null; S.cur = id; if (S.layer) { $('#layer').innerHTML = ''; S.layer = null; } closePop(); openLayer(drawerHTML(AL[id]), false, opener); }
function showAlert(id, opener) {
  if (S.view === 'alertas' && wide() && !S.layer) { S.acur = id; S.confirm = null; const a = AL[id]; if (S.atab !== 'tratados' && !isOpen(a)) S.atab = 'tratados'; render(false); const h = $('#dwt'); if (h) h.focus({ preventScroll: true }); }
  else openAlert(id, opener);
}
function refreshDetail(focusSel) {
  if (S.layer && $('.dw')) { $('#ov').innerHTML = drawerHTML(AL[S.cur]); const f = focusSel && $(focusSel, $('#ov')) || $('[data-close]', $('#ov')); if (f) f.focus(); }
  else { render(false); const f = focusSel && $(focusSel, $('#view')) || $('#dwt'); if (f) f.focus({ preventScroll: true }); }
}
const INS = [
  { k: 'ok', t: 'Crescimento sustentável', x: 'O faturamento de outubro foi R$ 8,0M, 8,1% acima de setembro. Em 12 meses, soma R$ 80,0M.', r: 'Manter a expansão nos CDs 1 e 2, que concentram 62,5% do faturamento.', c: ['Out: R$ 8,0M (+8,1%)', '12 meses: R$ 80,0M'] },
  { k: 'warn', t: 'Concentração na Logística', x: 'A Logística responde por 60% do faturamento e por 52 dos 90 clientes.', r: 'Aumentar a participação de Crossdocking e Marketplace para reduzir o risco da carteira.', c: ['Logística: 60%', 'Crossdocking: 20%', 'Marketplace: 15%'] },
  { k: 'warn', t: 'Prazo de recebimento longo', x: '45 dos 90 clientes (50%) só recebem em até 90 dias.', r: 'Rever as condições comerciais dos clientes de maior prazo.', c: ['Até 15 dias: 5', 'Até 90 dias: 45'] },
  { k: 'info', t: 'Sazonalidade', x: 'Os maiores faturamentos dos últimos 12 meses foram outubro (R$ 8,0M) e setembro (R$ 7,4M).', r: 'Reforçar a capacidade operacional no último trimestre. Veja a recomendação do CD 2.', c: ['Pico: R$ 8,0M', 'Média: R$ ' + nf(FAT12 / 12, 1) + 'M'], link: 'a-cd2' },
  { k: 'ok', t: 'Faltas e avarias dentro da meta', x: 'A taxa global é 1,0%, abaixo da meta de 2%.', r: 'Manter a conferência reforçada nos CDs 2 e 3, que têm os maiores índices.', c: ['Global: 1,0%', 'CD 2: 1,4%', 'CD 3: 1,1%'] }
];
const INK = { ok: ['ok', '✓ Sucesso'], warn: ['warn', '▲ Alerta'], info: ['info', 'i Informação'] };
function insightsHTML() {
  const f = { todos: INS, ok: INS.filter(i => i.k === 'ok'), warn: INS.filter(i => i.k === 'warn'), info: INS.filter(i => i.k === 'info') }[S.itab];
  const tabs = [['todos', 'Todos'], ['ok', 'Sucessos'], ['warn', 'Alertas'], ['info', 'Informações']];
  return '<div class="mdl" role="dialog" aria-modal="true" aria-labelledby="mt"><div class="dh"><div><h2 id="mt" style="font-size:1.15rem">Insights da operação</h2><p class="cs">Análises e recomendações a partir dos indicadores</p></div><button class="ibtn" data-close aria-label="Fechar">✕</button></div><div class="tabs" role="tablist" aria-label="Tipo de insight">' + tabs.map(t => '<button role="tab" aria-selected="' + (S.itab === t[0]) + '" data-itab="' + t[0] + '">' + t[1] + '</button>').join('') + '</div><div class="db">' + f.map(i => '<div class="ins"><div class="r"><b>' + i.t + '</b>' + st(INK[i.k][0], INK[i.k][1]) + '</div><p>' + i.x + '</p><p><b>Recomendação:</b> ' + i.r + '</p><div class="chips">' + i.c.map(c => '<span class="chip">' + c + '</span>').join('') + '</div>' + (i.link ? '<p style="margin:10px 0 0"><button class="btn sm" data-alert="' + i.link + '">Abrir o alerta do CD 2</button></p>' : '') + '</div>').join('') + '</div></div>';
}

/* ---------- ações ---------- */
const now = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
function setSt(id, s, msg) { const a = AL[id]; a.st = s; a.at = s === 'aberto' ? '' : now(); S.confirm = null; if (!S.layer) { S.acur = id; if (S.view === 'alertas') S.atab = s === 'aberto' ? 'todos' : 'tratados'; } render(false); if (S.layer) refreshDetail(s === 'aberto' ? '[data-act="ask"]' : null); else { const h = $('#dwt'); if (h) h.focus({ preventScroll: true }); } toast(msg); $('#live').textContent = msg; }
function act(k, id) {
  if (k === 'ask') { S.confirm = id; refreshDetail('[data-act="apply"]'); }
  else if (k === 'cancel') { S.confirm = null; refreshDetail('[data-act="ask"]'); }
  else if (k === 'apply') { const a = AL[id]; setSt(id, id === 'a-inad' ? 'encaminhado' : 'resolvido', a.rec.done + '. Indicadores atualizados.'); }
  else if (k === 'snooze') setSt(id, 'adiado', 'Alerta adiado por 4 horas.');
  else if (k === 'dismiss') setSt(id, 'dispensado', 'Alerta dispensado.');
  else if (k === 'read') setSt(id, 'lido', 'Marcado como lido.');
  else if (k === 'undo') setSt(id, 'aberto', 'Ação desfeita. O alerta voltou a aberto.');
  else if (k === 'reset') { ALIST.forEach(a => { a.st = 'aberto'; a.at = ''; }); S.msgs = []; S.acur = null; S.atab = 'todos'; closePop(); closeLayer(); render(false); toast('Demonstração reiniciada.'); }
  else if (k === 'logout') { closePop(); closeLayer(); S.auth = false; $('#app').hidden = true; $('#login').hidden = false; $('#lu').focus(); }
}

/* ---------- chat Chronus AI ---------- */
function answer(q) {
  const t = q.toLowerCase(), m = t.match(/cd ?([1-5])/), l = needAct();
  if (m) { const i = +m[1] - 1, o = occSt(occ(i)), s = slaSt(sla(i)); return { x: CDS[i] + ': ocupação ' + pct(occ(i), 0) + ' (' + o[1].slice(2) + '), SLA ' + pct(sla(i)) + ' (' + s[1].slice(2) + '), TFA ' + pct(B.tfa[i]) + ' e faturamento de ' + money(B.fat[i]) + ' em 12 meses.', go: CDAL[i] && isOpen(AL[CDAL[i]]) ? CDAL[i] : null }; }
  if (/decis|urgen|priorid|exige|preciso fazer|pendente|alerta/.test(t)) return l.length ? { x: l.length + ' item(ns) pedem sua decisão:\n' + l.map(a => '• ' + a.title).join('\n'), go: l[0].id } : { x: 'Nada exige sua decisão agora. Os alertas críticos e de atenção foram tratados.' };
  if (/pior|cr[ií]tic|problema|risco/.test(t)) { const w = CDS.map((_, i) => i).sort((a, b) => sla(a) - sla(b))[0]; return { x: 'O ' + CDS[w] + ' tem o menor SLA: ' + pct(sla(w)) + ' (meta ' + META_SLA + '%), com ocupação de ' + pct(occ(w), 0) + '.', go: CDAL[w] && isOpen(AL[CDAL[w]]) ? CDAL[w] : null }; }
  if (/sla/.test(t)) return { x: 'SLA global: ' + pct(slaG()) + ' (meta ' + META_SLA + '%).\n' + CDS.map((c, i) => c + ': ' + pct(sla(i))).join(' · ') };
  if (/ocupa|capacidade/.test(t)) return { x: 'Ocupação média ponderada: ' + pct(occG(), 0) + '.\n' + CDS.map((c, i) => c + ': ' + pct(occ(i), 0)).join(' · ') + '\nLimite operacional: ' + LIM_OCC + '%.' };
  if (/caixa|receb|pagar/.test(t)) return { x: 'Em 12 meses: a receber ' + money(REC12) + ' e a pagar ' + money(PAG12) + ', resultado de +' + money(REC12 - PAG12) + '. Em outubro: ' + money(SER.rec.mes[11]) + ' a receber contra ' + money(SER.pag.mes[11]) + ' a pagar.' };
  if (/inadimpl/.test(t)) return { x: 'Inadimplência global: ' + pct(SER.inad.mes[11]) + ' (meta abaixo de 3%). O Marketplace está em 3,8%, acima da meta.', go: isOpen(AL['a-inad']) ? 'a-inad' : null };
  if (/fatur|receita/.test(t)) return { x: 'Faturamento de ' + money(FAT12) + ' em 12 meses. Outubro: ' + money(SER.fat.mes[11]) + ', ' + pct(FAT_DELTA) + ' acima de setembro. Os CDs 1 e 2 concentram 62,5%.' };
  if (/custo/.test(t)) return { x: 'Custo operacional do mês: ' + money(CUSTO) + ', dentro do orçamento de ' + money(ORC) + '.' };
  if (/funil|venda|convers/.test(t)) return { x: 'De 100 leads, 25 viram clientes (25%). A maior perda está entre proposta e cliente: metade não avança.' };
  if (/score|carteira|cliente/.test(t)) return { x: 'Score médio da carteira: ' + nf(SCORE, 0) + ' em ' + CLI + ' clientes ativos. O Marketplace tem o menor score (68).' };
  if (/resum|semana|geral|situa|como estamos/.test(t)) return { x: 'Resumo: faturamento de ' + money(FAT12) + ' em 12 meses, SLA global ' + pct(slaG()) + ', inadimplência ' + pct(SER.inad.mes[11]) + '. ' + (l.length ? l.length + ' item(ns) pedem decisão.' : 'Nada pede decisão agora.'), go: l[0] && l[0].id };
  return { x: 'Ainda não sei responder isso com os dados do painel. Posso falar de decisões pendentes, SLA, ocupação, caixa, inadimplência, faturamento, custo, vendas, score e de cada CD (ex.: "como está o CD 3?").' };
}
function renderChat() {
  const c = $('#chat'); c.className = 'chat' + (S.chatOpen ? ' open' : '');
  if (!S.chatOpen) { c.innerHTML = '<button class="fab" id="fab" aria-label="Abrir o assistente Chronus AI">' + svgi('chat') + '</button>'; setTimeout(drawCharts, 0); return; }
  c.innerHTML = '<div class="cp" role="dialog" aria-label="Chronus AI, assistente"><div class="ch2"><div><b>Chronus AI</b><span>Responde com os dados deste painel</span></div><button class="ibtn" id="cclose" aria-label="Fechar o assistente">✕</button></div><div class="cm" id="cm" role="log" aria-live="polite">' +
    '<div class="msg bot">Olá! Sou o Chronus AI. Pergunte sobre o que exige decisão, SLA, ocupação, caixa ou qualquer CD.</div>' +
    S.msgs.map(m => '<div class="msg ' + m.r + '">' + esc(m.x).replace(/\n/g, '<br>') + (m.go ? '<button class="lk" data-alert="' + m.go + '">Abrir o alerta</button>' : '') + '</div>').join('') + '</div>' +
    '<div class="sg">' + ['O que exige minha decisão?', 'Qual CD está pior?', 'Como está o caixa?', 'Resuma a situação'].map(q => '<button data-q="' + q + '">' + q + '</button>').join('') + '</div>' +
    '<form class="cf2" id="cform"><label class="sr" for="cin">Mensagem</label><input id="cin" placeholder="Digite sua pergunta" autocomplete="off"><button class="btn pri" type="submit">Enviar</button></form></div>';
  const m = $('#cm'); m.scrollTop = m.scrollHeight; $('#cin').focus(); setTimeout(drawCharts, 0);
}
function ask(q) { q = q.trim(); if (!q) return; S.msgs.push({ r: 'me', x: q }); renderChat(); setTimeout(() => { const a = answer(q); S.msgs.push({ r: 'bot', x: a.x, go: a.go }); renderChat(); }, 350); }

/* ---------- login ---------- */
function enter() { S.auth = true; $('#login').hidden = true; $('#app').hidden = false; $('#chat').hidden = false; renderChat(); watch(); const v = (location.hash.match(/#\/(\w+)/) || [])[1]; go(VIEWS[v] ? v : 'estrategico', false); }
$('#lform').addEventListener('submit', e => {
  e.preventDefault(); let bad = null;
  [['lu', 'lu-e', 'lu-w'], ['lp', 'lp-e', 'lp-w']].forEach(k => { const empty = !$('#' + k[0]).value.trim(); $('#' + k[1]).hidden = !empty; $('#' + k[2]).classList.toggle('bad', empty); $('#' + k[0]).setAttribute('aria-invalid', empty); if (empty && !bad) bad = k[0]; });
  if (bad) $('#' + bad).focus(); else enter();
});
$('#demo').addEventListener('click', enter);
$('#eye').addEventListener('click', e => { const i = $('#lp'), s = i.type === 'password'; i.type = s ? 'text' : 'password'; e.currentTarget.textContent = s ? 'Ocultar' : 'Mostrar'; e.currentTarget.setAttribute('aria-pressed', s); });

/* ---------- eventos ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('button,[data-go],[data-alert]'); const p = $('#pop');
  if (!p.hidden && !e.target.closest('#pop') && !e.target.closest('#bell') && !e.target.closest('#avb')) closePop();
  if (e.target.id === 'ov') { closeLayer(); return; }
  if (!t) return;
  if (t.dataset.close !== undefined) closeLayer();
  else if (t.dataset.go) { const d = t.dataset.go; if (S.layer) closeLayer(); go(d); }
  else if (t.dataset.alert) showAlert(t.dataset.alert, t.closest('#pop') || t.closest('.msg') ? $('#bell') : t);
  else if (t.dataset.act) act(t.dataset.act, t.dataset.id);
  else if (t.dataset.period) { S.per = t.dataset.period; render(false); const b = $('[data-period="' + S.per + '"]'); if (b) b.focus(); $('#live').textContent = 'Período: ' + PER[S.per].n; }
  else if (t.dataset.tab) { S.atab = t.dataset.tab; render(false); const b = $('[data-tab="' + S.atab + '"]'); if (b) b.focus(); }
  else if (t.dataset.itab) { S.itab = t.dataset.itab; $('#ov').innerHTML = insightsHTML(); const b = $('[data-itab="' + S.itab + '"]'); if (b) b.focus(); }
  else if (t.dataset.themeSet) { setTheme(t.dataset.themeSet); $$('[data-theme-set]').forEach(b => b.setAttribute('aria-pressed', b.dataset.themeSet === S.theme)); }
  else if (t.dataset.q) ask(t.dataset.q);
  else if (t.id === 'bell') openPop('bell', t);
  else if (t.id === 'avb') openPop('acc', t);
  else if (t.id === 'insb') { S.itab = 'todos'; openLayer(insightsHTML(), true, t); }
  else if (t.id === 'colb') { S.mini = !S.mini; renderSide(); $('#colb').focus(); setTimeout(drawCharts, 220); }
  else if (t.id === 'burger') { const o = $('#shell').classList.toggle('open'); $('#scrim').classList.toggle('on', o); t.setAttribute('aria-expanded', o); }
  else if (t.id === 'fab') { S.chatOpen = true; renderChat(); }
  else if (t.id === 'cclose') { S.chatOpen = false; renderChat(); $('#fab').focus(); }
});
$('#scrim').addEventListener('click', () => { $('#shell').classList.remove('open'); $('#scrim').classList.remove('on'); $('#burger').setAttribute('aria-expanded', 'false'); });
document.addEventListener('submit', e => { if (e.target.id === 'cform') { e.preventDefault(); ask($('#cin').value); } });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (S.layer) closeLayer(); else if (!$('#pop').hidden) { closePop(); $('#bell').focus(); } else if (S.chatOpen) { S.chatOpen = false; renderChat(); $('#fab').focus(); } }
  else if (e.key === 'Tab' && S.layer) { const f = $$('button,[href],input,select', $('#ov')); if (!f.length) return; const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && e.target.getAttribute && e.target.getAttribute('role') === 'tab') { const tabs = $$('[role="tab"]', e.target.parentNode), i = tabs.indexOf(e.target), n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.click(); const sel = $('[role="tab"][aria-selected="true"]', $('#ov') || document); if (sel) sel.focus(); }
});
window.addEventListener('hashchange', () => { if (!S.auth) return; const v = (location.hash.match(/#\/(\w+)/) || [])[1]; if (v && v !== S.view) go(v, false); });
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('escuro');
window.__torre = { S: S, AL: AL, go: go, enter: enter };
})();
