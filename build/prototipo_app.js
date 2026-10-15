/* Prototipo navegavel "Ler a planta num relance". Dados ficticios. */
(function () {
  'use strict';
  var THEMES = JSON.parse(document.getElementById('themes').textContent);
  var NAMES = {
    'login-badge': 'Login by badge and PIN', 'login-sso': 'Login with SSO', 'home': 'Home',
    'widgets': 'Widget variations', 'circuits': 'Circuits', 'parameters': 'Parameters',
    'history': 'History', 'reports': 'Reports'
  };
  var S = { screen: 'login-badge', theme: 'claro', ai: 'on', resolved: false, acked: false, sp: 58.0, drawer: true };

  var scaler = document.getElementById('scaler');
  var stage = document.getElementById('stage');
  var vp = document.getElementById('vp');
  var jump = document.getElementById('jump');
  var toastEl = document.getElementById('toast');
  var live = document.getElementById('live');
  var toastT = null, flowCleanup = null, lastFocus = null;

  /* ---------- utilidades ---------- */
  function own(el) {
    var s = '';
    for (var i = 0; i < el.childNodes.length; i++) if (el.childNodes[i].nodeType === 3) s += el.childNodes[i].nodeValue;
    return s.replace(/\s+/g, ' ').trim();
  }
  function byText(root, text, sel) {
    var out = [], all = root.querySelectorAll(sel || '*');
    for (var i = 0; i < all.length; i++) if (own(all[i]) === text) out.push(all[i]);
    return out;
  }
  function byRe(root, re, sel) {
    var out = [], all = root.querySelectorAll(sel || '*');
    for (var i = 0; i < all.length; i++) if (re.test(own(all[i]))) out.push(all[i]);
    return out;
  }
  function up(el, pred, max) {
    var p = el; for (var i = 0; i < (max || 8) && p; i++) { if (pred(p)) return p; p = p.parentElement; } return null;
  }
  function replaceText(root, map) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      var t = n.nodeValue.replace(/\s+/g, ' ').trim();
      if (t && Object.prototype.hasOwnProperty.call(map, t)) n.nodeValue = n.nodeValue.replace(t, map[t]);
    }
  }
  function recolor(root) {
    if (!root) return;
    var els = [root].concat(Array.prototype.slice.call(root.querySelectorAll('[style]')));
    els.forEach(function (e) {
      var s = e.getAttribute('style'); if (!s) return;
      s = s.replace(/var\(--errBgHi,/g, 'var(--okBg,').replace(/var\(--errBg,/g, 'var(--okBg,')
           .replace(/var\(--errLine,/g, 'var(--ok,').replace(/var\(--danger,/g, 'var(--ok,');
      e.setAttribute('style', s);
    });
  }
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 3400);
  }
  function say(msg) { live.textContent = ''; setTimeout(function () { live.textContent = msg; }, 30); }
  function btnize(el, fn, label) {
    if (!el) return;
    if (el.tagName !== 'BUTTON' && el.tagName !== 'A') { el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0'); }
    if (el.tagName === 'A') { el.setAttribute('href', '#'); }
    if (label) el.setAttribute('aria-label', label);
    el.style.cursor = 'pointer';
    el.addEventListener('click', function (e) { e.preventDefault(); fn(e); });
    el.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && el.tagName !== 'BUTTON') { e.preventDefault(); fn(e); }
    });
  }
  function tpl(id) { return document.getElementById('t-' + id); }

  /* ---------- tema ---------- */
  function setTheme(name) {
    S.theme = name; var v = THEMES[name];
    for (var k in v) scaler.style.setProperty(k, v[k]);
    document.body.setAttribute('data-theme', name);
    var r = document.querySelector('input[name="tema"][value="' + name + '"]'); if (r) r.checked = true;
  }

  /* ---------- escala ---------- */
  function fit() {
    var w = parseInt(scaler.getAttribute('data-w') || '1440', 10);
    var s = Math.min(1, vp.clientWidth / w);
    scaler.style.transform = 'scale(' + s + ')';
    vp.style.height = Math.ceil(scaler.offsetHeight * s) + 'px';
    scaler.style.marginLeft = Math.max(0, (vp.clientWidth - w * s) / 2 / s) + 'px';
  }
  if (window.ResizeObserver) new ResizeObserver(fit).observe(vp); else window.addEventListener('resize', fit);

  /* ---------- montagem das telas ---------- */
  function mount(id, opts) {
    opts = opts || {};
    closeFlow(true);
    var t = tpl(id); if (!t) return;
    stage.innerHTML = '';
    stage.appendChild(t.content.cloneNode(true));
    scaler.setAttribute('data-w', t.getAttribute('data-w'));
    S.screen = id;
    if (S.resolved) applyResolved(id);
    enhanceCommon();
    var fn = ENH[id]; if (fn) fn();
    jump.value = id === 'home' || NAMES[id] ? id : 'home';
    try { history.replaceState(null, '', '#' + id); } catch (e) { /* ignorar */ }
    fit();
    if (opts.focus !== false) { stage.focus({ preventScroll: true }); window.scrollTo(0, 0); say('Screen: ' + (NAMES[id] || id)); }
  }

  function applyResolved(id) {
    var el;
    if (id === 'home') {
      el = byText(stage, '▲ 1')[0]; if (el) recolor(up(el, function (e) { return /errBg/.test(e.getAttribute('style') || ''); }, 8));
      replaceText(stage, {
        '▲ 1': '✓ 0', 'ACTION NEEDED': 'ACTIONS NEEDED',
        'SAG_Ouvido_Eletronico drifting below control band for 12 min — AI cannot compensate without a setpoint change.': 'SAG_Ouvido_Eletronico is back in band after the 14:54 setpoint change. Nothing needs you right now.',
        '▲ 1 at limit': '✓ 0 at limit', '17 in range': '18 in range',
        '▲ Ouvido_Eletronico below band': '✓ Ouvido_Eletronico back in band',
        'Operator action required — setpoint locked by policy': 'Setpoint 58.00 applied by S. Oliveira'
      });
      byText(stage, 'Acknowledge', 'button').forEach(function (b) { b.style.display = 'none'; });
    }
    if (id === 'circuits') {
      el = byText(stage, '▲ AT LIMIT')[0]; if (el) recolor(up(el, function (e) { return /border:1px/.test(e.getAttribute('style') || ''); }, 6));
      el = byText(stage, 'OUVIDO_ELETRONICO BELOW BAND')[0]; if (el) recolor(up(el, function (e) { return /errBg|errLine/.test(e.getAttribute('style') || ''); }, 5));
      replaceText(stage, { '▲ 1': '✓', 'OUVIDO_ELETRONICO BELOW BAND': '6 PARAMS · ALL IN RANGE', '▲ AT LIMIT': '✓ IN RANGE', '▲ Ouvido eletrônico': 'Ouvido eletrônico', '50.54 %': '58.00 %' });
    }
    if (id === 'parameters') {
      el = byText(stage, '▲ SAG_Ouvido_Eletronico')[0];
      if (el) recolor(up(el, function (e) { return /grid-template-columns/.test(e.getAttribute('style') || ''); }, 6));
      replaceText(stage, { '18 SUPERVISED · 1 AT LIMIT': '18 SUPERVISED · 0 AT LIMIT', '▲ SAG_Ouvido_Eletronico': 'SAG_Ouvido_Eletronico', '50.54': '58.00' });
    }
  }

  /* ---------- comportamentos comuns ---------- */
  function enhanceCommon() {
    var navs = stage.querySelectorAll('[data-go]');
    for (var i = 0; i < navs.length; i++) (function (b) {
      b.addEventListener('click', function () { mount(b.getAttribute('data-go')); });
    })(navs[i]);
    var pill = byText(stage, '✓ AI ACTIVE', 'span')[0];
    if (pill) {
      var box = pill.parentElement;
      if (S.ai === 'off') {
        pill.textContent = '▲ AI OFF · MANUAL';
        box.style.background = 'var(--errBg)'; box.style.borderColor = 'var(--errLine)'; pill.style.color = 'var(--danger)';
      }
      btnize(box, function () { openFlow(S.ai === 'on' ? 1 : 3); },
        S.ai === 'on' ? 'AI is active. Open the turn off AI control flow.' : 'AI is off, manual mode. Open the turn AI back on step.');
    }
    byText(stage, 'SO', 'div').forEach(function (a) { a.setAttribute('aria-label', 'Operator S. Oliveira'); });
  }

  /* ---------- por tela ---------- */
  var ENH = {
    'login-badge': function () {
      btnize(byText(stage, 'Start shift', 'button')[0], function () { mount('home'); });
      byText(stage, 'CHANGE', 'span').forEach(function (e) { btnize(e, function () { toast('Changing operator is outside this prototype.'); }); });
    },
    'login-sso': function () {
      btnize(byText(stage, 'Continue with corporate SSO', 'button')[0], function () { mount('home'); });
      var em = stage.querySelector('input[type=email]'), pw = stage.querySelector('input[type=password]');
      var sign = byText(stage, 'Sign in', 'button')[0];
      function err(input, msg) {
        var old = input.parentElement.querySelector('.perr'); if (old) old.remove();
        input.removeAttribute('aria-invalid'); input.style.borderColor = '';
        if (!msg) return;
        var d = document.createElement('div'); d.className = 'perr'; d.id = input.id + '-err'; d.textContent = msg;
        d.style.cssText = "font:500 12.5px 'IBM Plex Sans',sans-serif;color:var(--danger);margin-top:6px";
        input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', d.id);
        input.style.borderColor = 'var(--danger)'; input.insertAdjacentElement('afterend', d);
      }
      em.addEventListener('input', function () { err(em, ''); });
      pw.addEventListener('input', function () { err(pw, ''); });
      btnize(sign, function () {
        err(em, ''); err(pw, '');
        if (!/^\S+@\S+\.\S+$/.test(em.value)) { err(em, 'Enter a valid e-mail, like name@company.com.'); em.focus(); return; }
        if (!pw.value) { err(pw, 'Enter your password.'); pw.focus(); return; }
        mount('home');
      });
      stage.querySelectorAll('input').forEach(function (i) { i.addEventListener('keydown', function (e) { if (e.key === 'Enter') sign.click(); }); });
      ['Forgot?', 'Request access'].forEach(function (t) {
        byText(stage, t, 'a').forEach(function (a) { btnize(a, function () { toast('This link is outside the prototype.'); }); });
      });
    },
    'home': function () {
      var ack = byText(stage, 'Acknowledge', 'button')[0];
      btnize(ack, function () {
        S.acked = true; ack.textContent = '✓ Acknowledged'; ack.setAttribute('aria-disabled', 'true'); ack.style.opacity = '.7';
        toast('Alarm acknowledged. It stays open until the setpoint changes.');
      });
      if (S.acked && ack) { ack.textContent = '✓ Acknowledged'; ack.style.opacity = '.7'; }
      btnize(byText(stage, 'Open circuit', 'button')[0], function () { mount('circuits'); });
    },
    'circuits': function () {
      byRe(stage, /^Open \d+ parameters$/, 'div').forEach(function (d) { btnize(d, function () { mount('parameters'); }); });
    },
    'parameters': function () {
      var drawer = null, grid = null;
      var x = byText(stage, '✕', 'span')[0];
      if (x) { drawer = up(x, function (e) { return /border-left/.test(e.getAttribute('style') || ''); }, 4); grid = drawer && drawer.parentElement; }
      function setDrawer(open) {
        S.drawer = open; if (!drawer) return;
        drawer.style.display = open ? '' : 'none';
        grid.style.gridTemplateColumns = open ? '210px 1fr 400px' : '210px 1fr';
        fit();
      }
      if (x) btnize(x, function () { setDrawer(false); }, 'Close setpoint panel');
      var rowEl = byText(stage, S.resolved ? 'SAG_Ouvido_Eletronico' : '▲ SAG_Ouvido_Eletronico')[0];
      var row = rowEl && up(rowEl, function (e) { return /grid-template-columns/.test(e.getAttribute('style') || ''); }, 6);
      if (row) btnize(row, function () { setDrawer(true); }, 'Open setpoint panel for SAG_Ouvido_Eletronico');
      if (!S.drawer) setDrawer(false);
      var val = byRe(stage, /^\d+\.\d\d$/, 'div').filter(function (d) { return /flex:1/.test(d.getAttribute('style') || '') && /height:44px/.test(d.getAttribute('style') || ''); })[0];
      if (val) val.classList.add('fieldval');
      function fmt() { if (val) val.textContent = S.sp.toFixed(2); }
      fmt();
      var minus = byText(stage, '−', 'button')[0], plus = byText(stage, '+', 'button')[0];
      if (minus) { minus.setAttribute('aria-label', 'Decrease setpoint'); btnize(minus, function () { S.sp = Math.max(40, Math.round((S.sp - 0.5) * 100) / 100); fmt(); }); }
      if (plus) { plus.setAttribute('aria-label', 'Increase setpoint'); btnize(plus, function () { S.sp = Math.min(90, Math.round((S.sp + 0.5) * 100) / 100); fmt(); }); }
      btnize(byText(stage, 'Reject', 'button')[0], function () { setDrawer(false); toast('Recommendation rejected. The setpoint stays at 50.54.'); });
      var apply = byText(stage, 'Apply setpoint', 'button')[0];
      btnize(apply, function () {
        if (S.sp < 55 || S.sp > 65) { toast('Outside the control band (55 to 65). Adjust the value to apply.'); return; }
        S.resolved = true; S.acked = true;
        mount('parameters', { focus: false });
        toast('Setpoint ' + S.sp.toFixed(2) + ' applied. The alarm on Home is cleared (illustrative).');
        say('Setpoint applied. Alarm cleared.');
      });
      if (S.resolved && apply) { apply.textContent = '✓ Applied'; apply.setAttribute('aria-disabled', 'true'); apply.style.opacity = '.75'; }
    },
    'history': function () {
      btnize(byText(stage, 'Export CSV', 'button')[0], function () { toast('Export simulated. Nothing is downloaded in this prototype.'); });
    },
    'reports': function () {
      btnize(byText(stage, 'New report', 'button')[0], function () { toast('New report draft created (illustrative).'); });
      btnize(byText(stage, 'Download PDF', 'button')[0], function () { toast('PDF download simulated.'); });
      var send = byText(stage, 'Sign & send', 'button')[0];
      btnize(send, function () {
        send.textContent = '✓ Sent'; send.style.opacity = '.75';
        byText(stage, 'DRAFT').forEach(function (e) { e.textContent = 'SENT'; });
        toast('Shift handover signed and sent (illustrative).');
      });
    }
  };

  /* ---------- fluxo: desligar a IA ---------- */
  function closeFlow(silent) {
    if (flowCleanup) { flowCleanup(); flowCleanup = null; }
    var ov = scaler.querySelector('.ov'); if (ov) ov.remove();
    document.removeEventListener('keydown', onFlowKey, true);
    if (!silent && lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }
  function onFlowKey(e) {
    var ov = scaler.querySelector('.ov'); if (!ov) return;
    if (e.key === 'Escape') { e.preventDefault(); var ab = ov.querySelector('[data-abort]'); if (ab) ab.click(); else closeFlow(); return; }
    if (e.key === 'Tab') {
      var f = ov.querySelectorAll('button,select,[tabindex="0"]'); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  function overlay(step, label) {
    var old = scaler.querySelector('.ov'); if (old) old.remove();
    if (flowCleanup) { flowCleanup(); flowCleanup = null; }
    var ov = document.createElement('div'); ov.className = 'ov';
    var box = document.createElement('div'); box.className = 'ovc';
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', label);
    box.appendChild(tpl('flow' + step).content.cloneNode(true));
    ov.appendChild(box);
    var x = document.createElement('button'); x.type = 'button'; x.className = 'ovx';
    x.textContent = step === 3 ? 'Continue in manual mode' : 'Close';
    x.addEventListener('click', function () { var ab = ov.querySelector('[data-abort]'); if (ab) ab.click(); else closeFlow(); });
    ov.appendChild(x);
    scaler.appendChild(ov);
    document.addEventListener('keydown', onFlowKey, true);
    return box;
  }
  function openFlow(step) {
    lastFocus = document.activeElement;
    if (step === 1) flow1(); else if (step === 3) flow3();
  }
  function flow1() {
    var box = overlay(1, 'Turn off AI control, step 1 of 3, confirm');
    var holdBtn = byText(box, 'Hold to confirm', 'button')[0], cancel = byText(box, 'Cancel', 'button')[0];
    var lab = byText(box, 'Reason (recorded in the log)', 'label')[0];
    var ph = byText(box, 'Select a reason…', 'span').concat(byText(box, 'Select a reason…', 'div'))[0];
    var holder = ph && up(ph, function (e) { return /height:/.test(e.getAttribute('style') || ''); }, 3);
    var sel = document.createElement('select'); sel.id = 'reason';
    ['Select a reason…', 'Maintenance on feed belt BL4', 'Sensor fault', 'Process upset', 'Other'].forEach(function (t, i) {
      var o = document.createElement('option'); o.value = i ? t : ''; o.textContent = t; sel.appendChild(o);
    });
    if (holder) { sel.style.cssText = holder.getAttribute('style') + ';width:100%;appearance:auto;cursor:pointer'; holder.replaceWith(sel); }
    if (lab) lab.setAttribute('for', 'reason');
    var msg = document.createElement('div'); msg.id = 'reason-err';
    msg.style.cssText = "font:500 12.5px 'IBM Plex Sans',sans-serif;color:var(--danger);margin-top:6px;min-height:0";
    sel.insertAdjacentElement('afterend', msg);
    sel.addEventListener('change', function () { msg.textContent = ''; sel.removeAttribute('aria-invalid'); });
    btnize(cancel, function () { closeFlow(); });

    var dur = 1200, raf = null, t0 = 0, holding = false;
    holdBtn.innerHTML = '<span class="hbar"></span><span class="hlbl">Hold to confirm</span>';
    holdBtn.style.position = 'relative'; holdBtn.style.overflow = 'hidden';
    holdBtn.setAttribute('aria-describedby', 'hold-help');
    var help = document.createElement('div'); help.id = 'hold-help';
    help.style.cssText = "font:400 11.5px 'IBM Plex Sans',sans-serif;color:var(--ink3);margin-top:8px";
    help.textContent = 'Press and hold for about one second. Keyboard: hold Space or Enter.';
    holdBtn.parentElement.insertAdjacentElement('afterend', help);
    var bar = holdBtn.querySelector('.hbar');
    function reset() { holding = false; cancelAnimationFrame(raf); bar.style.width = '0'; }
    function start() {
      if (holding) return;
      if (!sel.value) { msg.textContent = 'Select a reason to continue.'; sel.setAttribute('aria-invalid', 'true'); sel.setAttribute('aria-describedby', 'reason-err'); sel.focus(); return; }
      holding = true; t0 = performance.now();
      (function tick(now) {
        var k = Math.min(1, (now - t0) / dur); bar.style.width = (k * 100) + '%';
        if (k >= 1) { S.reason = sel.value; holding = false; flow2(); return; }
        raf = requestAnimationFrame(tick);
      })(t0);
    }
    holdBtn.addEventListener('pointerdown', function (e) { e.preventDefault(); start(); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { holdBtn.addEventListener(ev, reset); });
    holdBtn.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); start(); } });
    holdBtn.addEventListener('keyup', function (e) { if (e.key === ' ' || e.key === 'Enter') reset(); });
    flowCleanup = reset;
    sel.focus();
    say('Turn off AI control. Step 1 of 3. Choose a reason, then hold to confirm.');
  }
  function flow2() {
    if (flowCleanup) { flowCleanup(); flowCleanup = null; }
    var box = overlay(2, 'Turn off AI control, step 2 of 3, handover in progress');
    var n = 0, label = byRe(box, /OF 18 PARAMETERS HANDED OVER/)[0];
    var barBox = label && label.previousElementSibling, fill = barBox && barBox.firstElementChild;
    var rows = ['SAG_Velocidade', 'SAG_Celula_Carga', 'SAG_Potencia', 'Throughput_Alimentacao'].map(function (t) {
      var e = byText(box, t)[0]; return e && e.querySelector('span');
    });
    var ab = byText(box, 'Abort and keep AI on', 'button')[0];
    ab.setAttribute('data-abort', '1');
    var timer = setInterval(function () {
      n++;
      if (label) label.textContent = n + ' OF 18 PARAMETERS HANDED OVER';
      if (fill) fill.style.width = (n / 18 * 100) + '%';
      if (rows[0]) rows[0].textContent = '✓ manual'; if (rows[1]) rows[1].textContent = '✓ manual';
      if (rows[2]) rows[2].textContent = n >= 14 ? '✓ manual' : 'handing over…';
      if (rows[3]) rows[3].textContent = n >= 18 ? '✓ manual' : (n >= 14 ? 'handing over…' : 'queued');
      if (n >= 18) { clearInterval(timer); flowCleanup = null; S.ai = 'off'; say('Handover complete. AI control is off.'); flow3(true); }
    }, 220);
    flowCleanup = function () { clearInterval(timer); };
    btnize(ab, function () { clearInterval(timer); flowCleanup = null; closeFlow(); toast('Handover aborted. AI control stays on.'); });
    ab.focus();
    say('Handover in progress. Step 2 of 3.');
  }
  function flow3(fromFlow) {
    if (fromFlow) mount(S.screen, { focus: false });
    var box = overlay(3, 'Turn off AI control, step 3 of 3, manual mode');
    var back = byText(box, 'Turn AI back on', 'button')[0];
    btnize(back, function () {
      S.ai = 'on'; closeFlow(true); mount(S.screen, { focus: false }); toast('AI control resumed. 18 parameters are supervised again.');
    });
    var r = byRe(box, /^Reason:/)[0]; if (r && S.reason) r.textContent = 'Reason: ' + S.reason;
    back.focus();
    say('Manual mode. Step 3 of 3.');
  }

  /* ---------- barra do prototipo ---------- */
  jump.addEventListener('change', function () {
    var v = jump.value;
    if (v === 'flow') { mount('home'); openFlow(1); jump.value = 'flow'; }
    else mount(v);
  });
  Array.prototype.forEach.call(document.querySelectorAll('input[name="tema"]'), function (r) {
    r.addEventListener('change', function () { setTheme(r.value); });
  });
  document.getElementById('reset').addEventListener('click', function () {
    S.ai = 'on'; S.resolved = false; S.acked = false; S.sp = 58.0; S.drawer = true;
    mount('login-badge'); toast('Prototype restarted.');
  });

  setTheme('claro');
  var start = (location.hash || '').replace('#', '');
  mount(NAMES[start] ? start : 'login-badge', { focus: false });
})();
