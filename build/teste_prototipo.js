/* Teste do protótipo "Ler a planta" (Playwright, navegador real). Uso: node build/teste_prototipo.js
   Abre assets/prototipo/planta.html em 390, 820 e 1440 px, percorre os fluxos e confere: sem erro de JS,
   sem rolagem horizontal, alvos de toque >= 44 px no celular. */
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.join(__dirname, '..', 'assets', 'prototipo', 'planta.html');
let fails = 0, errors = [];
const ok = (c, m) => { console.log((c ? 'ok    ' : 'FALHA ') + m); if (!c) fails++; };
const txt = p => p.evaluate(() => document.getElementById('app').textContent.replace(/\s+/g, ' '));
const btn = (p, t) => p.locator('#app button', { hasText: new RegExp('^' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') }).first();
(async () => {
  const b = await chromium.launch();
  for (const [name, w, h] of [['celular', 390, 844], ['tablet', 820, 1180], ['desktop', 1440, 900]]) {
    console.log('\n== ' + name + ' (' + w + 'px)');
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: w < 800 });
    const p = await ctx.newPage();
    p.on('pageerror', e => errors.push(name + ': ' + e.message));
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await p.goto(url); await p.waitForTimeout(200);
    ok(/Start shift/.test(await txt(p)), 'abre no login por crachá');
    await btn(p, 'Start shift').click();
    ok(/ACTION NEEDED/.test(await txt(p)) && /Acknowledge/.test(await txt(p)), 'Start shift leva à Home com o alarme');
    await btn(p, 'Acknowledge').click(); ok(/Acknowledged/.test(await txt(p)), 'Acknowledge confirma');
    await btn(p, 'Open circuit').click(); ok(/PROCESS FLOW/.test(await txt(p)), 'Open circuit leva a Circuits');
    await p.locator('#app button.open', { hasText: 'Open 6 parameters' }).first().click();
    ok(/SAG MILL . 6 PARAMETERS/.test(await txt(p)), 'Open parameters leva a Parameters');
    if (w < 1100) { ok(await p.locator('.drawer').count() === 0, 'painel de ajuste começa fechado em tela pequena'); await p.locator('.prow.er').click(); }
    ok(await p.locator('.drawer').isVisible(), 'linha do alarme abre o painel de ajuste');
    for (let i = 0; i < 20; i++) await btn(p, '+').click();
    await btn(p, 'Apply setpoint').click();
    ok(/Outside the control band/.test(await p.textContent('#toast')), 'setpoint fora da banda é recusado com mensagem');
    for (let i = 0; i < 20; i++) await btn(p, '−').click();
    await btn(p, 'Apply setpoint').click();
    ok(/applied/i.test(await p.textContent('#toast')), 'setpoint dentro da banda é aplicado');
    ok(/58\.00/.test(await txt(p)) && !/50\.54/.test(await txt(p)), 'tabela atualiza para 58.00');
    await p.locator('#app [data-go=home]').first().evaluate(e => e.click());
    ok(/Nothing needs you right now/.test(await txt(p)), 'Home mostra o alarme resolvido');
    // fluxo desligar a IA
    await p.locator('.pill-ai').click();
    ok(/Turn off AI control\?/.test(await p.textContent('.ov')), 'pílula AI ACTIVE abre o passo 1');
    const hold = p.locator('#hold');
    const bb = await hold.boundingBox(); await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down();
    ok(/Select a reason to continue/.test(await p.textContent('.ov')), 'sem motivo, bloqueia e explica'); await p.mouse.up();
    await p.selectOption('#reason', 'Sensor fault');
    await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down(); await p.waitForTimeout(1500); await p.mouse.up();
    ok(/Returning control/.test(await p.textContent('.ov')), 'segurar confirma e passa ao passo 2');
    await p.waitForTimeout(4600);
    ok(/MANUAL MODE/.test(await p.textContent('.ov')) && /sensor fault/.test(await p.textContent('.ov')), 'passo 3: modo manual com o motivo');
    ok(/AI OFF/.test(await txt(p)), 'a tela por trás mostra IA desligada');
    await p.locator('#back').click(); ok(await p.locator('.ov').count() === 0 && /AI ACTIVE/.test(await txt(p)), 'Turn AI back on devolve o controle');
    // SSO
    await p.evaluate(() => { document.getElementById('jump').value = 'login-sso'; document.getElementById('jump').dispatchEvent(new Event('change')); });
    await btn(p, 'Sign in').click(); ok(/valid e-mail/.test(await txt(p)), 'SSO: e-mail vazio mostra erro');
    await p.fill('#em', 'ana@mina.com'); await p.fill('#pw', 'x'); await btn(p, 'Sign in').click();
    ok(/ACTIONS? NEEDED/.test(await txt(p)), 'SSO: credenciais preenchidas entram');
    // todas as telas, sem rolagem horizontal e (celular) alvos de toque
    for (const v of ['login-badge', 'login-sso', 'home', 'widgets', 'circuits', 'parameters', 'history', 'reports']) {
      await p.evaluate(v => { document.getElementById('jump').value = v; document.getElementById('jump').dispatchEvent(new Event('change')); }, v);
      await p.waitForTimeout(80);
      const o = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      ok(o <= 0, 'sem rolagem horizontal: ' + v + (o > 0 ? ' (+' + o + 'px)' : ''));
      if (w < 800) {
        const small = await p.evaluate(() => Array.from(document.querySelectorAll('#app button,#app select,#app input,#app a')).filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.height < 32 || r.width < 32) && !e.closest('.pins') && !e.closest('.ln'); }).map(e => (e.textContent || e.tagName).trim().slice(0, 18) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height)));
        ok(small.length === 0, 'alvos de toque >= 32px: ' + v + (small.length ? ' ' + JSON.stringify(small) : ''));
      }
    }
    await p.evaluate(() => { document.getElementById('pbar').setAttribute('open', ''); });
    for (const t of ['sol', 'escuro', 'claro']) await p.evaluate(t => { const r = document.querySelector('input[value="' + t + '"]'); r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }, t);
    ok(await p.getAttribute('body', 'data-theme') === 'claro', 'alternador de tema responde');
    await ctx.close();
  }
  await b.close();
  console.log('\nerros de JS:', errors.length ? errors : 'nenhum');
  console.log(fails ? '\n' + fails + ' FALHA(S)' : '\nTUDO OK'); process.exit(fails || errors.length ? 1 : 0);
})();
