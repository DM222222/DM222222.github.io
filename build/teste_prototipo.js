/* Teste de fumaca do prototipo (jsdom). Uso: node build/teste_prototipo.js */
const { JSDOM } = require('/tmp/jt/node_modules/jsdom');
const fs = require('fs'), path = require('path');
const file = path.join(__dirname, '..', 'assets', 'prototipo', 'planta.html');
const errors = [];
const dom = new JSDOM(fs.readFileSync(file, 'utf8'), { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/planta.html' });
const w = dom.window, d = w.document;
w.addEventListener('error', e => errors.push('ERRO JS: ' + e.message));
w.HTMLElement.prototype.scrollIntoView = function () {};
w.scrollTo = function () {};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const stage = () => d.getElementById('stage');
const txt = () => stage().textContent.replace(/\s+/g, ' ');
const own = el => Array.from(el.childNodes).filter(n => n.nodeType === 3).map(n => n.nodeValue).join(' ').replace(/\s+/g, ' ').trim();
const find = (root, t, sel) => Array.from(root.querySelectorAll(sel || '*')).find(e => own(e) === t);
let fails = 0;
function ok(cond, msg) { console.log((cond ? 'ok    ' : 'FALHA ') + msg); if (!cond) fails++; }
const click = el => el.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));

(async () => {
  await sleep(100);
  ok(/Start shift/.test(txt()), 'abre no login por cracha');
  click(find(stage(), 'Start shift', 'button'));
  ok(/ACTION NEEDED/.test(txt()) && /Acknowledge/.test(txt()), 'Start shift leva a Home com o alarme');

  // reconhecer
  click(find(stage(), 'Acknowledge', 'button'));
  ok(/Acknowledged/.test(txt()), 'Acknowledge confirma');

  // home -> circuits -> parameters
  click(find(stage(), 'Open circuit', 'button'));
  ok(/PROCESS FLOW/.test(txt()), 'Open circuit leva a Circuits');
  const open = Array.from(stage().querySelectorAll('div')).find(e => /^Open \d+ parameters$/.test(own(e)));
  click(open);
  ok(/SAG mill . 6 PARAMETERS/i.test(txt()) || /SETPOINT/.test(txt()), 'Open parameters leva a Parameters');

  // validacao do setpoint fora da banda
  const plus = find(stage(), '+', 'button');
  for (let i = 0; i < 20; i++) click(plus);
  click(find(stage(), 'Apply setpoint', 'button'));
  ok(/Outside the control band/.test(d.getElementById('toast').textContent), 'setpoint fora da banda e recusado com mensagem');
  const minus = find(stage(), '−', 'button');
  for (let i = 0; i < 20; i++) click(minus);
  click(find(stage(), 'Apply setpoint', 'button'));
  ok(/applied/i.test(d.getElementById('toast').textContent), 'setpoint dentro da banda e aplicado');
  ok(/58\.00/.test(txt()) && !/50\.54/.test(txt()), 'tabela atualiza para 58.00');

  // home resolvida
  click(find(stage(), 'Home', 'button'));
  ok(/Nothing needs you right now/.test(txt()) && !/drifting below control band/.test(txt()), 'Home mostra o alarme resolvido');

  // fluxo de desligar a IA
  const pill = find(stage(), '✓ AI ACTIVE', 'span').parentElement;
  click(pill);
  const ov = () => d.querySelector('.ov');
  ok(!!ov() && /Turn off AI control\?/.test(ov().textContent), 'pilula AI ACTIVE abre o passo 1');
  const hold = find(ov(), 'Hold to confirm', 'button') || ov().querySelector('button.hold, button[aria-describedby="hold-help"]');
  hold.dispatchEvent(new w.Event('pointerdown', { bubbles: true, cancelable: true }));
  ok(/Select a reason to continue/.test(ov().textContent), 'sem motivo, bloqueia e explica');
  const sel = ov().querySelector('select'); sel.value = 'Sensor fault'; sel.dispatchEvent(new w.Event('change', { bubbles: true }));
  hold.dispatchEvent(new w.Event('pointerdown', { bubbles: true, cancelable: true }));
  await sleep(1500);
  ok(/Returning control/.test(ov().textContent), 'segurar confirma e passa ao passo 2');
  await sleep(4400);
  ok(/MANUAL MODE/.test(ov().textContent) && /Sensor fault/.test(ov().textContent), 'passo 3: modo manual com o motivo escolhido');
  ok(/AI OFF/.test(txt()), 'a tela por tras mostra IA desligada');
  click(find(ov(), 'Turn AI back on', 'button'));
  ok(!ov() && /AI ACTIVE/.test(txt()), 'Turn AI back on devolve o controle');

  // login SSO com validacao
  w.document.getElementById('jump').value = 'login-sso';
  w.document.getElementById('jump').dispatchEvent(new w.Event('change'));
  click(find(stage(), 'Sign in', 'button'));
  ok(/valid e-mail/.test(txt()), 'SSO: e-mail vazio mostra erro');
  stage().querySelector('input[type=email]').value = 'ana@mina.com';
  stage().querySelector('input[type=password]').value = 'x';
  click(find(stage(), 'Sign in', 'button'));
  ok(/Acknowledge|ACTIONS? NEEDED/.test(txt()), 'SSO: credenciais preenchidas entram');

  // todas as telas montam
  for (const v of ['login-badge', 'login-sso', 'home', 'widgets', 'circuits', 'parameters', 'history', 'reports']) {
    d.getElementById('jump').value = v; d.getElementById('jump').dispatchEvent(new w.Event('change'));
    ok(stage().children.length > 0 && txt().length > 100, 'tela monta: ' + v);
  }
  // temas
  for (const t of ['sol', 'escuro', 'claro']) {
    const r = d.querySelector('input[value="' + t + '"]'); r.checked = true; r.dispatchEvent(new w.Event('change', { bubbles: true }));
  }
  ok(d.body.getAttribute('data-theme') === 'claro', 'alternador de tema responde');
  console.log('\nerros de JS:', errors.length ? errors : 'nenhum');
  console.log(fails ? '\n' + fails + ' FALHA(S)' : '\nTUDO OK');
  process.exit(fails || errors.length ? 1 : 0);
})();
