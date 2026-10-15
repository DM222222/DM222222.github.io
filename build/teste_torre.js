/* Teste de fumaça da Torre (jsdom). Uso: node build/teste_torre.js */
const { JSDOM } = require('/tmp/jt/node_modules/jsdom');
const fs = require('fs'), path = require('path');
const dom = new JSDOM(fs.readFileSync(path.join(__dirname, '..', 'assets', 'prototipo', 'torre.html'), 'utf8'), { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/torre.html' });
const w = dom.window, d = w.document, errs = [];
w.addEventListener('error', e => errs.push(e.message)); w.scrollTo = () => {};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const $ = s => d.querySelector(s), $$ = s => Array.from(d.querySelectorAll(s));
const txt = () => $('#view').textContent.replace(/\s+/g, ' ');
const click = el => el.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
const btn = (t, root) => Array.from((root || d).querySelectorAll('button')).find(b => b.textContent.replace(/\s+/g, ' ').trim().startsWith(t));
let fails = 0; const ok = (c, m) => { console.log((c ? 'ok    ' : 'FALHA ') + m); if (!c) fails++; };
(async () => {
  await sleep(100);
  ok(!$('#login').hidden && $('#app').hidden, 'abre no login');
  $('#lform').dispatchEvent(new w.Event('submit', { cancelable: true }));
  ok(!$('#lu-e').hidden && !$('#lp-e').hidden && $('#login').hidden === false, 'login vazio mostra os dois erros');
  $('#lu').value = 'ana'; $('#lp').value = 'x'; $('#lform').dispatchEvent(new w.Event('submit', { cancelable: true }));
  ok($('#login').hidden && !$('#app').hidden, 'login preenchido entra');
  ok($$('.dc').length === 3, 'Estratégico abre com 3 decisões');
  ok($('#bbadge').textContent === '3', 'sino mostra 3');
  const slaAntes = $$('.kpi .v')[2].textContent;

  // filtros mudam os dados
  const aria1 = $('.ch svg').getAttribute('aria-label');
  click($('[data-period="semana"]')); const aria2 = $('.ch svg').getAttribute('aria-label');
  click($('[data-period="ano"]')); const aria3 = $('.ch svg').getAttribute('aria-label');
  ok(aria1 !== aria2 && aria2 !== aria3, 'Semana/Mês/Ano mudam os dados do gráfico');
  click($('[data-period="mes"]'));

  // fluxo do alerta crítico
  click($('[data-alert="a-cd2"]'));
  ok(!!$('.dw') && /Mover 1\.700 posições/.test($('.dw').textContent), 'abre o detalhe com a recomendação');
  click(btn('Aplicar recomendação', $('.dw')));
  ok(/Confirmar a transferência/.test($('.dw').textContent), 'pede confirmação');
  click(btn('Cancelar', $('.dw'))); ok(!/Confirmar a transferência/.test($('.dw').textContent), 'cancelar volta');
  click(btn('Aplicar recomendação', $('.dw'))); click(btn('Confirmar', $('.dw')));
  ok(/Carga transferida/.test($('.dw').textContent) && /Desfazer/.test($('.dw').textContent), 'aplica e oferece desfazer');
  ok(/Carga transferida/.test($('#toast').textContent), 'avisa por toast');
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  ok(!$('.dw'), 'Esc fecha o detalhe');
  ok($$('.dc').length === 2 && $('#bbadge').textContent === '2', 'decisões e sino caem para 2');
  ok($$('.kpi .v')[2].textContent !== slaAntes, 'SLA global recalculado (' + slaAntes + ' → ' + $$('.kpi .v')[2].textContent + ')');
  w.__torre.go('operacao');
  ok(/80%/.test(txt()) && /56%/.test(txt()), 'Operação reflete CD 2 em 80% e CD 5 em 56%');
  ok(/94,0%/.test(txt()), 'SLA do CD 2 vai a 94,0%');

  // fichas e mapa de calor (sem seletores)
  ok($$('.fc').length === 5 && /1,4%/.test(txt()), 'Operação: 5 fichas por CD com TFA');
  ok($$('.hm td.num').length === 15, 'CMC em matriz CD × turno');
  ok(!!$('.fc [data-alert="a-cd3"]') && !$('.fc [data-alert="a-cd2"]'), 'ficha só oferece alerta aberto');
  // alertas: abas, contagens e estado vazio
  w.__torre.go('alertas');
  ok(/Abertos \(6\)/.test(txt()) && /Críticos \(0\)/.test(txt()) && /Atenção \(2\)/.test(txt()) && /Info \(4\)/.test(txt()) && /Tratados \(1\)/.test(txt()), 'contagens derivadas da lista (6/0/2/4/1)');
  click($('[data-tab="crit"]')); ok(/Nenhum alerta crítico/.test(txt()), 'aba Críticos vazia tem estado vazio');
  click($('[data-tab="tratados"]')); ok(/Resolvido/.test(txt()), 'aba Tratados mostra o resolvido');
  click($('[data-alert="a-cd2"]')); click(btn('Desfazer', $('.dw')));
  ok(/Ação desfeita/.test($('#toast').textContent) && !!btn('Aplicar recomendação', $('.dw')), 'desfazer reabre o alerta');
  click(btn('Dispensar', $('.dw'))); ok(/dispensado/i.test($('#toast').textContent), 'dispensar funciona');
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  click($('[data-tab="todos"]')); click($('[data-alert="a-fat"]')); click(btn('Marcar como lido', $('.dw'))); ok(/lido/i.test($('#toast').textContent), 'informativo: marcar como lido');
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

  // sino, avatar, tema
  click($('#bell')); ok(!$('#pop').hidden && /Alertas que pedem atenção/.test($('#pop').textContent), 'sino abre a lista');
  click($('#avb')); ok(/Reiniciar demonstração/.test($('#pop').textContent), 'avatar abre o menu');
  click($('[data-theme-set="escuro"]')); ok(d.documentElement.getAttribute('data-theme') === 'escuro', 'tema escuro');
  click($('[data-act="reset"]')); ok(!/Tratados \(1\)/.test(txt()) || /Abertos \(7\)/.test(txt()), 'reiniciar volta ao inicial');

  // insights
  click($('#insb')); ok(!!$('.mdl') && $$('.ins').length === 5, 'Insights abre com 5 itens');
  click($('[data-itab="warn"]')); ok($$('.ins').length === 2, 'aba Alertas do Insights filtra');
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); ok(!$('.mdl'), 'Esc fecha o Insights');

  // chat
  click($('#fab')); ok(!!$('.cp'), 'chat abre');
  $('#cin').value = 'Como está o CD 3?'; $('#cform').dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true })); await sleep(500);
  ok(/CD 3: ocupação 82%/.test($('#cm').textContent), 'chat responde com os dados do CD 3');
  click(btn('O que exige minha decisão?', $('.cp'))); await sleep(500);
  ok(/pedem sua decisão/.test($('#cm').textContent), 'chat lista as decisões pendentes');
  $('#cin').value = 'qual a cor do céu'; $('#cform').dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true })); await sleep(500);
  ok(/Ainda não sei responder/.test($('#cm').textContent), 'chat admite o que não sabe');

  // menu, rotas, sair
  click($('#colb')); ok($('#shell').classList.contains('mini'), 'menu recolhe');
  w.location.hash = '#/vendas'; await sleep(50); ok(/Funil de conversão/.test(txt()), 'rota por hash');
  for (const v of ['estrategico', 'tatico', 'vendas', 'financeiro', 'operacao', 'alertas']) { w.__torre.go(v); ok(txt().length > 300 && !!$('#h1'), 'tela monta: ' + v); }
  click($('#avb')); click($('[data-act="logout"]')); ok(!$('#login').hidden && $('#app').hidden, 'sair volta ao login');
  console.log('\nerros de JS:', errs.length ? errs : 'nenhum'); console.log(fails ? '\n' + fails + ' FALHA(S)' : '\nTUDO OK');
  process.exit(fails || errs.length ? 1 : 0);
})();
