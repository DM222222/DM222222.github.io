/* Protótipo navegável "Ler a planta num relance". Dados fictícios. Layout fluido (celular, tablet, desktop). */
(function () {
  'use strict';
  var THEMES = JSON.parse(document.getElementById('themes').textContent);
  var NAMES = { 'login-badge': 'Login by badge and PIN', 'login-sso': 'Login with SSO', home: 'Home', widgets: 'Widget variations',
    circuits: 'Circuits', parameters: 'Parameters', history: 'History', reports: 'Reports' };
  var NAV = [['home', 'Home'], ['circuits', 'Circuits'], ['parameters', 'Parameters'], ['history', 'History'], ['reports', 'Reports']];
  var S = { screen: 'login-badge', theme: 'claro', ai: 'on', resolved: false, acked: false, sp: 58.0, drawer: true, circ: 'SAG mill',
    view: 'FLOW', series: { t: true, p: true }, ev: -1, sent: false, rep: 0, range: '7 DAYS', hrange: '12H' };
  var root = document.documentElement, app = document.getElementById('app'), jump = document.getElementById('jump');
  var toastEl = document.getElementById('toast'), live = document.getElementById('live');
  var toastT = null, flowCleanup = null, lastFocus = null, ovEl = null;

  /* ---------- utilidades ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function toast(m) { toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 3400); }
  function say(m) { live.textContent = ''; setTimeout(function () { live.textContent = m; }, 30); }
  function f2(n) { return n.toFixed(2); }
  function setTheme(n) {
    S.theme = n; var v = THEMES[n]; for (var k in v) root.style.setProperty(k, v[k]);
    document.body.setAttribute('data-theme', n); var r = $('input[name="tema"][value="' + n + '"]'); if (r) r.checked = true;
  }

  /* ---------- gráficos desenhados na largura real ---------- */
  function spark(pts, vw, h) {
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join(' ');
    return '<svg viewBox="0 0 ' + vw + ' ' + h + '" preserveAspectRatio="none" height="' + h + '" aria-hidden="true"><path d="' + d + ' L' + vw + ' ' + h + ' L0 ' + h + ' Z" fill="var(--accentSoft)"/><path d="' + d + '" fill="none" stroke="var(--accent)" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg>';
  }
  var SP_HOME = [[0, 34], [50, 32], [100, 28], [150, 30], [200, 22], [250, 18], [300, 20], [350, 12], [400, 8]];
  var SP_SAG = [[0, 40], [48, 38], [96, 34], [144, 36], [192, 30], [240, 26], [288, 28], [340, 22]];
  var SP_BALL = [[0, 34], [48, 36], [96, 32], [144, 30], [192, 32], [240, 28], [288, 30], [340, 26]];
  var SP_FLOT = [[0, 30], [48, 28], [96, 32], [144, 26], [192, 28], [240, 24], [288, 26], [340, 24]];

  function chartHome(W) {
    var H = W < 520 ? 190 : 220, ml = W < 520 ? 34 : 40, mr = 10, mt = 12, mb = 36, pw = W - ml - mr, ph = H - mt - mb;
    function X(f) { return (ml + f * pw).toFixed(1); } function Y(f) { return (mt + f * ph).toFixed(1); }
    var fs = W < 520 ? 10 : 11, o = '';
    [0, 1 / 3, 2 / 3, 1].forEach(function (f, i) {
      o += '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + Y(f) + '" y2="' + Y(f) + '" stroke="var(--grid)"/>' +
        '<text x="' + (ml - 6) + '" y="' + (+Y(f) + 4) + '" text-anchor="end" font-family="IBM Plex Mono" font-size="' + fs + '" fill="var(--ink3)">' + [400, 390, 380, 370][i] + '</text>';
    });
    var act = [[0, 150], [96, 142], [192, 134], [288, 128], [384, 120], [480, 112], [528, 108]], fc = [[528, 108], [624, 96], [720, 84], [756, 78]];
    function pt(p) { return X(p[0] / 756) + ' ' + Y((p[1] - 14) / 156); }
    var nowX = X(528 / 756 + 0.0);
    o += '<rect x="' + nowX + '" y="' + Y(.333) + '" width="' + (ml + pw - nowX) + '" height="' + (ph / 3) + '" fill="var(--accentSoft)" opacity=".7"/>' +
      '<path d="M' + act.map(pt).join(' L') + '" fill="none" stroke="var(--accent)" stroke-width="3"/>' +
      '<path d="M' + fc.map(pt).join(' L') + '" fill="none" stroke="var(--accent)" stroke-width="3" stroke-dasharray="7 5"/>' +
      '<path d="M' + nowX + ' ' + Y(0) + ' V' + Y(1) + '" stroke="var(--ink3)" stroke-dasharray="3 3"/>' +
      '<circle cx="' + nowX + '" cy="' + Y((108 - 14) / 156) + '" r="5" fill="var(--surface)" stroke="var(--accent)" stroke-width="3"/>' +
      '<text x="' + (+nowX + 8) + '" y="' + (mt + 14) + '" font-family="IBM Plex Mono" font-size="' + (fs - .5) + '" fill="var(--ink2)">' + (W < 520 ? 'NOW →' : 'NOW · FORECAST →') + '</text>';
    var tk = W < 520 ? [['07:00', 0], ['11:00', .254], ['15:00', .508], ['19:00', .825]] : [['07:00', 0], ['09:00', .127], ['11:00', .254], ['13:00', .381], ['15:00', .508], ['17:00', .635], ['19:00', .825], ['21:00', .97]];
    tk.forEach(function (t) { o += '<text x="' + X(t[1]) + '" y="' + (H - 12) + '" text-anchor="' + (t[1] === 0 ? 'start' : (t[1] > .95 ? 'end' : 'middle')) + '" font-family="IBM Plex Sans" font-size="' + (fs + .5) + '" fill="var(--ink2)">' + t[0] + '</text>'; });
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="Throughput this shift: actual rose from about 372 to 382 t/h; AI forecast continues up to about 385 t/h with a confidence band.">' + o + '</svg>';
  }
  function chartHist(W) {
    var H = W < 520 ? 240 : 260, ml = W < 520 ? 34 : 44, mr = W < 520 ? 34 : 44, mt = 12, mb = 54, pw = W - ml - mr, ph = H - mt - mb, fs = W < 520 ? 10 : 11, o = '';
    function X(x) { return (ml + (x - 56) / 874 * pw).toFixed(1); } function Y(y) { return (mt + (y - 14) / 174 * ph).toFixed(1); }
    [14, 72, 130, 188].forEach(function (y, i) {
      o += '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + Y(y) + '" y2="' + Y(y) + '" stroke="var(--grid)"/>' +
        '<text x="' + (ml - 6) + '" y="' + (+Y(y) + 4) + '" text-anchor="end" font-family="IBM Plex Mono" font-size="' + fs + '" fill="var(--ink3)">' + [400, 385, 370, 355][i] + '</text>' +
        '<text x="' + (W - mr + 6) + '" y="' + (+Y(y) + 4) + '" font-family="IBM Plex Mono" font-size="' + fs + '" fill="var(--ink3)">' + ['81.0', '80.5', '80.0', '79.5'][i] + '</text>';
    });
    o += '<rect x="' + X(430) + '" y="' + Y(14) + '" width="' + (X(556) - X(430)) + '" height="' + (Y(188) - Y(14)) + '" fill="var(--errBg)" stroke="var(--errLine)"/>' +
      '<text x="' + ((+X(430) + +X(556)) / 2) + '" y="' + (mt + 20) + '" text-anchor="middle" font-family="IBM Plex Mono" font-size="' + (fs - .5) + '" fill="var(--danger)">AI OFF · 4h</text>';
    var xs = [56, 181, 306, 430, 493, 556, 681, 806, 930], ty = [96, 88, 80, 74, 148, 92, 78, 70, 62], py = [132, 128, 126, 122, 168, 126, 122, 118, 116];
    function path(ys) { return 'M' + xs.map(function (x, i) { return X(x) + ' ' + Y(ys[i]); }).join(' L'); }
    if (S.series.t) o += '<path d="' + path(ty) + '" fill="none" stroke="var(--accent)" stroke-width="3"/>';
    if (S.series.p) o += '<path d="' + path(py) + '" fill="none" stroke="var(--ok)" stroke-width="2" stroke-dasharray="6 4"/>';
    [[430, 74, 'danger', 0], [556, 92, 'ok', 1], [806, 70, 'accent', 3]].forEach(function (m) {
      o += '<g data-act="marker" data-ev="' + m[3] + '" tabindex="0" role="button" aria-label="Show event ' + (m[3] + 1) + '" style="cursor:pointer"><circle cx="' + X(m[0]) + '" cy="' + Y(m[1]) + '" r="16" fill="transparent"/><circle cx="' + X(m[0]) + '" cy="' + Y(m[1]) + '" r="' + (S.ev === m[3] ? 8 : 5) + '" fill="var(--surface)" stroke="var(--' + m[2] + ')" stroke-width="3"/></g>';
    });
    var lb = W < 520 ? [['05 AUG', 56], ['07', 306], ['09', 556], ['TODAY', 930]] : [['05 AUG', 56], ['06', 181], ['07', 306], ['08', 430], ['09', 556], ['10', 681], ['11', 806], ['TODAY', 930]];
    lb.forEach(function (t) { o += '<text x="' + X(t[1]) + '" y="' + (H - 32) + '" text-anchor="' + (t[1] === 56 ? 'start' : (t[1] === 930 ? 'end' : 'middle')) + '" font-family="IBM Plex Sans" font-size="' + (fs + .5) + '" fill="var(--ink2)">' + t[0] + '</text>'; });
    o += '<text x="' + ml + '" y="' + (H - 10) + '" font-family="IBM Plex Mono" font-size="' + (fs - .5) + '" fill="var(--ink3)">' + (W < 520 ? 'LEFT t/h · RIGHT P80 % · 7-DAY MEAN 379 t/h' : 'LEFT AXIS t/h · RIGHT AXIS P80 % · 7-DAY MEAN 379 t/h') + '</text>';
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="Throughput and P80 over 7 days. AI was off for 4 hours on 8 August; throughput dropped about 11.6 t/h.">' + o + '</svg>';
  }
  function drawCharts() {
    $$('[data-chart]').forEach(function (b) {
      var W = Math.max(240, Math.floor(b.clientWidth)); var k = b.getAttribute('data-chart');
      if (k === 'home') b.innerHTML = chartHome(W); else if (k === 'hist') b.innerHTML = chartHist(W);
    });
  }

  /* ---------- peças comuns ---------- */
  function chrome(active, meta) {
    var off = S.ai === 'off';
    var nav = NAV.map(function (n) { return '<button type="button" data-go="' + n[0] + '"' + (n[0] === active ? ' aria-current="page"' : '') + '>' + n[1] + '</button>'; }).join('');
    var tabs = NAV.map(function (n) { return '<button type="button" data-go="' + n[0] + '"' + (n[0] === active ? ' aria-current="page"' : '') + '>' + n[1] + '</button>'; }).join('');
    return '<div class="top"><div class="l"><div class="brand"><div class="logo"></div><span class="nm">PRODUCT NAME</span></div><nav class="nav" aria-label="Main">' + nav + '</nav></div>' +
      '<div class="r"><span class="meta">' + meta + '</span>' +
      '<button type="button" class="pill-ai' + (off ? ' off' : '') + '" data-act="ai" aria-label="' + (off ? 'AI is off, manual mode. Open the turn AI back on step.' : 'AI is active. Open the turn off AI control flow.') + '"><span>' + (off ? '▲ AI OFF · MANUAL' : '✓ AI ACTIVE') + '</span></button>' +
      '<div class="avatar" aria-label="Operator S. Oliveira" role="img">SO</div></div></div>' +
      '<div class="shiftrow">' + meta + '</div>' +
      '<nav class="tabs" aria-label="Main (mobile)">' + tabs + '</nav>';
  }

  /* ---------- telas ---------- */
  var R = function () { return S.resolved; };
  var T = {};

  T['login-badge'] = function () {
    return '<div class="lg2"><div class="lstat"><div><div class="brandrow"><div class="brand"><div class="logo"></div><span class="nm">PRODUCT NAME</span></div><span class="m">CONCENTRATOR 2 · CONSOLE 04</span></div>' +
      '<div class="lbl" style="padding:34px 0 12px">PLANT STATUS BEFORE YOU SIGN IN</div>' +
      '<div class="kk"><div><div class="lbl">THROUGHPUT</div><div class="b">380<span>t/h</span></div></div><div><div class="lbl">P80</div><div class="b">80.1<span>%</span></div></div><div><div class="lbl">OPEN ALARMS</div><div class="b">2<span>low</span> <span style="color:var(--okInk)">✓</span></div></div></div>' +
      '<div class="aibox"><b>✓</b> AI control active and supervising 18 parameters. Signing in does not change plant state.</div></div>' +
      '<svg class="wave" viewBox="0 0 640 60" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="var(--waveDim)"><path d="M4 20 C120 4 190 4 300 20 C410 36 480 36 636 16"/><path d="M4 30 C120 14 190 14 300 30 C410 46 480 46 636 26"/><path d="M4 44 C120 28 190 28 300 44 C410 60 480 60 636 40"/></g><path d="M4 37 C120 21 190 21 300 37 C410 53 480 53 636 33" fill="none" stroke="var(--accent)" stroke-width="1.8"/></svg></div>' +
      '<div class="lform"><div class="eb">SHIFT SIGN-IN</div><h1>Tap your badge</h1>' +
      '<div class="rfid"><div class="ic">))</div><div><b>Waiting for RFID badge…</b><span>Reader on the right of the console</span></div></div>' +
      '<div class="or">OR ENTER PIN</div><div class="pins" aria-hidden="true"><input tabindex="-1" value="•" readonly><input tabindex="-1" value="•" readonly><input class="nx" tabindex="-1" readonly><input tabindex="-1" readonly></div>' +
      '<div class="op"><label>Operator</label><div class="opb"><span>S. Oliveira · Operations</span><button type="button" data-act="change">CHANGE</button></div></div>' +
      '<button type="button" class="btn-p go" data-act="start">Start shift</button>' +
      '<p class="fine">Session ends automatically at shift handover (19:00). Password sign-in available for remote access.</p></div></div>';
  };
  T['login-sso'] = function () {
    return '<div class="sso"><div class="tag">IMAGE PLACEHOLDER — plant / crusher wide shot, desaturated</div><form class="box" novalidate data-form="sso"><div class="brand"><div class="logo"></div><span class="nm">PRODUCT NAME</span></div><h1>Sign in to continue</h1>' +
      '<button type="button" class="ssob" data-act="start"><i></i>Continue with corporate SSO</button><div class="or">OR</div>' +
      '<div class="fl"><label for="em">E-mail</label><input id="em" type="email" placeholder="name@company.com" autocomplete="email"></div>' +
      '<div class="fl"><div class="lr"><label for="pw">Password</label><a href="#" class="ln" data-act="out">Forgot?</a></div><input id="pw" type="password" placeholder="••••••••" autocomplete="current-password"></div>' +
      '<button type="button" class="btn-p go" data-act="signin">Sign in</button><div class="f2">Don\'t have an account? <a href="#" class="ln" data-act="out">Request access</a></div></form></div>';
  };
  T.home = function () {
    var r = R(), cls = r ? 'alarm ok' : 'alarm';
    var h = chrome('home', 'SHIFT B · 07:00–19:00 · 4h12 REMAINING');
    h += '<div class="' + cls + '"><div class="a-l"><span class="n">' + (r ? '✓ 0' : '▲ 1') + '</span><span class="t">' + (r ? 'ACTIONS NEEDED' : 'ACTION NEEDED') + '</span></div>' +
      '<div class="a-m"><span class="msg">' + (r ? 'SAG_Ouvido_Eletronico is back in band after the 14:54 setpoint change. Nothing needs you right now.' : 'SAG_Ouvido_Eletronico drifting below control band for 12 min — AI cannot compensate without a setpoint change.') + '</span><span class="when">14:38 · SAG MILL</span></div>' +
      '<div class="a-b">' + (r ? '' : '<button type="button" class="btn-o" data-act="ack"' + (S.acked ? ' aria-disabled="true" style="opacity:.7"' : '') + '>' + (S.acked ? '✓ Acknowledged' : 'Acknowledge') + '</button>') +
      '<button type="button" class="btn-d' + (r ? ' ok' : '') + '" data-act="opencirc">Open circuit</button></div></div>';
    h += '<div class="home-k"><div class="card kpi"><div class="h"><span class="lbl">THROUGHPUT</span><span class="m3">TARGET 375 t/h</span></div><div class="v"><span class="big">380</span><span class="u">t/h</span><span class="d">↑ +1.3% vs target</span></div>' + spark(SP_HOME, 400, 46) + '<div class="scale"><span>SHIFT START</span><span>NOW</span></div></div>' +
      '<div class="card kpi"><div class="h"><span class="lbl">QUALITY P80</span><span class="m3">BAND 79.5–80.5</span></div><div class="v"><span class="big">80.1</span><span class="u">%</span><span class="s ok-t">✓ IN BAND</span></div><div class="bandbar"><div class="b" style="left:38%;width:24%"></div><div class="p" style="left:49%"></div></div><div class="scale"><span>78.0</span><span>DEVIATION 0.9%</span><span>82.0</span></div></div>' +
      '<div class="card kpi"><div class="h"><span class="lbl">AI SUPERVISION</span><span class="m3">18 PARAMETERS</span></div><div class="v"><span class="big">' + (r ? 18 : 17) + '</span><span class="u sm">in range</span><span class="s ' + (r ? 'ok-t' : 'er-t') + '">' + (r ? '✓ 0 at limit' : '▲ 1 at limit') + '</span></div>' +
      '<div class="bars" aria-hidden="true">' + new Array(18).join('<i></i>') + '<i' + (r ? '' : ' class="x"') + '></i></div><div class="m3" style="padding-top:5px">ONE BAR PER SUPERVISED PARAMETER · RED = AT RANGE LIMIT</div></div></div>';
    h += '<div class="home-b"><div class="card"><div class="ph"><span class="sec">THIS SHIFT — ACTUAL vs AI PREDICTION</span><div class="chips">' + ['12H', '24H', '7D'].map(function (c) { return '<button type="button" class="chip" data-act="hrange" data-v="' + c + '" aria-pressed="' + (S.hrange === c) + '">' + c + '</button>'; }).join('') + '</div></div>' +
      '<div class="chartbox"><div data-chart="home"></div><div class="legend"><span>ACTUAL —</span><span>FORECAST ---</span><span>CONFIDENCE BAND ▨</span></div></div></div>' +
      '<div class="card"><div class="ph"><span class="sec">AI ACTIVITY LOG</span><span class="m2">LAST 60 MIN</span></div>' +
      logrow('14:38', r ? '✓ Ouvido_Eletronico back in band' : '▲ Ouvido_Eletronico below band', r ? 'Setpoint 58.00 applied by S. Oliveira' : 'Operator action required — setpoint locked by policy', r ? 'ok' : 'er') +
      logrow('14:26', 'SAG_Velocidade 9.94 → 9.99 RPM', 'Applied by AI · predicted +4 t/h') + logrow('14:02', 'Work Index signal lost', 'Model running on 17 of 18 inputs') + logrow('13:41', 'Cycle closed · accuracy 99.5%', 'Actual 368 t/h vs predicted 372 t/h') +
      '<button type="button" class="more" data-act="out">View full log</button></div></div>';
    return h;
  };
  function logrow(t, ti, ds, c) { return '<div class="logrow"><span class="tm">' + t + '</span><div><div class="ti ' + (c || '') + '">' + ti + '</div><div class="ds">' + ds + '</div></div></div>'; }

  T.circuits = function () {
    var r = R(), h = chrome('circuits', 'SHIFT B · 14:52');
    h += '<div class="tool"><span class="lbl">SITE</span><span class="site">Concentrator 2 <span aria-hidden="true">⌄</span></span><div class="seg" role="group" aria-label="View">' +
      ['FLOW', 'TABLE'].map(function (v) { return '<button type="button" class="pillbtn" data-act="view" data-v="' + v + '" aria-pressed="' + (S.view === v) + '">' + v + '</button>'; }).join('') + '</div>' +
      '<div class="key"><span><i style="background:var(--ok)"></i>IN RANGE</span><span><i style="background:var(--danger)"></i>AT LIMIT</span><span><i style="background:var(--ink3)"></i>NO SIGNAL</span></div></div>';
    var st = [['Primary crushing', '392', 't/h', '3 PARAMS · ALL IN RANGE', ''], ['Stockpile', '68', '% full', 'NOT SUPERVISED', 'na'],
      ['SAG mill', '380', 't/h', r ? '6 PARAMS · ALL IN RANGE' : 'OUVIDO_ELETRONICO BELOW BAND', r ? '' : 'er'], ['Ball mill', '378', 't/h', '6 PARAMS · ALL IN RANGE', ''], ['Flotation', '80.1', '% P80', '8 PARAMS · ALL IN RANGE', '']];
    if (S.view === 'FLOW') {
      h += '<div class="card flowcard"><div class="fh"><span class="sec">PROCESS FLOW · MATERIAL LEFT TO RIGHT</span><span class="m2">SELECT A STAGE TO OPEN ITS PARAMETERS</span></div><div class="flow">' +
        st.map(function (s, i) {
          return (i ? '<span class="arrow" aria-hidden="true">→</span>' : '') + '<button type="button" class="stage ' + s[4] + '" data-act="stage" data-c="' + s[0] + '"><div class="sn"><span>' + s[0].toUpperCase() + '</span>' + (s[4] === 'er' ? '<b>▲ 1</b>' : (s[0] === 'SAG mill' && r ? '<b style="color:var(--okInk)">✓</b>' : '')) + '</div><div class="sv">' + s[1] + ' <span>' + s[2] + '</span></div><div class="sx">' + s[3] + '</div></button>';
        }).join('') + '</div></div>';
    } else {
      h += '<div class="card flowcard" style="padding:0"><div class="htab">' + '<div class="hrow h" style="grid-template-columns:1.4fr 1fr 2fr"><span>STAGE</span><span>VALUE</span><span style="text-align:left;font-family:var(--sans)">STATUS</span></div>' +
        st.map(function (s) { return '<button type="button" class="hrow ' + (s[4] === 'er' ? 'off' : '') + '" style="grid-template-columns:1.4fr 1fr 2fr;width:100%;text-align:left;border:0;border-top:1px solid var(--line);background:transparent;color:inherit" data-act="stage" data-c="' + s[0] + '"><span style="font-family:var(--sans)">' + s[0] + '</span><span style="text-align:left">' + s[1] + ' ' + s[2] + '</span><span style="text-align:left;font-size:11px;color:' + (s[4] === 'er' ? 'var(--danger)' : 'var(--ink2)') + '">' + s[3] + '</span></button>'; }).join('') + '</div></div>';
    }
    function cc(name, flag, ok, pts, rows, n) {
      return '<div class="card cc' + (ok ? '' : ' er') + '"><div class="ch"><b>' + name + '</b><span>' + flag + '</span></div><div class="sp">' + spark(pts, 340, 64) + '</div>' +
        rows.map(function (x) { return '<div class="pr' + (x[2] ? ' er' : '') + '">' + x[0] + '<span>' + x[1] + '</span></div>'; }).join('') +
        '<button type="button" class="open link" data-act="stage" data-c="' + name.charAt(0) + name.slice(1).toLowerCase() + '">Open ' + n + ' parameters</button></div>';
    }
    h += '<div class="ccards">' +
      cc('SAG MILL', r ? '✓ IN RANGE' : '▲ AT LIMIT', r, SP_SAG, [['Velocidade', '9.99 RPM'], ['Potência', '4,861 kW'], [r ? 'Ouvido eletrônico' : '▲ Ouvido eletrônico', r ? '58.00 %' : '50.54 %', !r]], 6) +
      cc('BALL MILL', '✓ IN RANGE', true, SP_BALL, [['Carga de bolas', '31.2 %'], ['Densidade polpa', '1.42 t/m³'], ['Potência', '5,120 kW']], 6) +
      cc('FLOTATION', '✓ IN RANGE', true, SP_FLOT, [['P80', '80.1 %'], ['pH célula 1', '10.4'], ['Ar célula 3', '7.8 m³/min']], 8) + '</div>';
    return h;
  };

  /* parâmetros */
  var CIRC = { 'SAG mill': 6, 'Ball mill': 6, Flotation: 8, Crushing: 3 };
  function rowsFor(c) {
    var r = R();
    if (c === 'SAG mill') return [
      { n: 'SAG_Velocidade', u: 'RPM · AI', l: 28, w: 44, p: 56, a: '9.99', t: '9.99' },
      { n: 'SAG_Celula_Carga', u: 't · AI', l: 24, w: 48, p: 62, a: '97.45', t: '98.10' },
      { n: 'SAG_Potencia', u: 'kW', l: 30, w: 42, p: 48, a: '4,861', t: '—' },
      { n: (r ? '' : '▲ ') + 'SAG_Ouvido_Eletronico', u: '% · AI', l: 34, w: 40, p: r ? 52 : 20, a: r ? '58.00' : '50.54', t: '58.00', er: !r, sel: true, key: true },
      { n: 'Throughput_Alimentacao_BL4', u: 't/h · AI', l: 26, w: 46, p: 44, a: '14.10', t: '14.20' },
      { n: 'Work_Index', u: 'WI', ns: true, a: '—', t: '—' }];
    if (c === 'Ball mill') return [{ n: 'Carga_de_Bolas', u: '% · AI', l: 30, w: 44, p: 52, a: '31.2', t: '31.5' }, { n: 'Densidade_Polpa', u: 't/m³ · AI', l: 28, w: 46, p: 46, a: '1.42', t: '1.42' }, { n: 'Potencia_Moinho', u: 'kW', l: 32, w: 40, p: 58, a: '5,120', t: '—' }];
    if (c === 'Flotation') return [{ n: 'P80', u: '% · AI', l: 38, w: 24, p: 49, a: '80.1', t: '80.0' }, { n: 'pH_Celula_1', u: 'pH · AI', l: 30, w: 40, p: 50, a: '10.4', t: '10.4' }, { n: 'Ar_Celula_3', u: 'm³/min · AI', l: 28, w: 44, p: 46, a: '7.8', t: '7.9' }];
    return [{ n: 'Britador_Vazao', u: 't/h', l: 30, w: 44, p: 54, a: '392', t: '—' }, { n: 'Britador_Abertura', u: 'mm · AI', l: 26, w: 46, p: 48, a: '38', t: '38' }, { n: 'Correia_Corrente', u: 'A', l: 32, w: 40, p: 50, a: '212', t: '—' }];
  }
  T.parameters = function () {
    if (S.dInit === undefined) { S.dInit = true; S.drawer = window.innerWidth >= 1100; }
    var r = R(), c = S.circ, rows = rowsFor(c), key = c === 'SAG mill';
    var h = chrome('parameters', '18 SUPERVISED · ' + (r ? 0 : 1) + ' AT LIMIT');
    var open = S.drawer && key;
    h += '<div class="pgrid' + (open ? '' : ' closed') + '"><aside class="pside"><div class="grp c"><div class="mini">CIRCUIT</div><div class="list">' +
      Object.keys(CIRC).map(function (k) { return '<button type="button" class="ci" data-act="circ" data-c="' + k + '" aria-pressed="' + (k === c) + '">' + k + '<span>' + CIRC[k] + '</span></button>'; }).join('') + '</div></div>' +
      '<div class="grp"><div class="mini">TYPE</div><div class="flt"><div class="r"><i class="bx on"></i>AI controlled <em>4</em></div><div class="r"><i class="bx"></i>Process only <em>14</em></div></div></div>' +
      '<div class="grp"><div class="mini">STATUS</div><div class="flt"><div class="r"><i class="bx on"></i>✓ In range <em>' + (r ? 17 : 16) + '</em></div><div class="r"><i class="bx on"></i>' + (r ? '' : '▲ ') + 'At limit <em>' + (r ? 0 : 1) + '</em></div><div class="r"><i class="bx on"></i>— No signal <em>1</em></div></div></div></aside>' +
      '<main class="pmain"><div class="th"><span class="sec">' + c.toUpperCase() + ' · ' + CIRC[c] + ' PARAMETERS</span><span class="lg"><span><i class="b"></i>CONTROL BAND</span><span><i class="a"></i>ACTUAL</span></span></div>' +
      '<div class="ptab" role="table" aria-label="Parameters"><div class="phead" role="row"><span>PARAMETER</span><span>POSITION IN BAND</span><span>ACTUAL</span><span>AI TARGET</span></div>' +
      rows.map(function (x) {
        if (x.ns) return '<div class="prow nosig" role="row"><div class="nm">' + x.n + '<small>' + x.u + '</small></div><div class="rb ns">NO SIGNAL SINCE 14:02</div><div class="ac dash">—</div><div class="tg dash">—</div></div>';
        var b = '<div class="rb"><div class="b" style="left:' + x.l + '%;width:' + x.w + '%"></div><div class="p' + (x.er ? ' x' : '') + '" style="left:' + x.p + '%"></div></div>';
        var inner = '<div class="nm">' + x.n + '<small>' + x.u + '</small></div>' + b + '<div class="ac' + (x.t === '—' && x.a ? '' : '') + '">' + x.a + '</div><div class="tg' + (x.t === '—' ? ' dash' : '') + '">' + x.t + '</div>' + (x.er ? '<div class="go">Review the AI recommendation →</div>' : '');
        if (x.key) return '<button type="button" class="prow' + (x.er ? ' er' : '') + (open ? ' sel' : '') + '" data-act="row" aria-label="Open setpoint panel for SAG_Ouvido_Eletronico">' + inner + '</button>';
        return '<div class="prow" role="row">' + inner + '</div>';
      }).join('') + '</div>' +
      (key ? '<div class="note"><b aria-hidden="true">i</b><span>Model is running on 17 of 18 inputs. Prediction confidence dropped from 99.5% to 97.8% while Work_Index is missing.</span></div>' : '<div class="note"><b aria-hidden="true">i</b><span>Prototype shows the three parameters of this circuit that matter most. The full table follows the same pattern.</span></div>') + '</main>';
    if (open) h += drawer();
    h += '</div><div class="scrim' + (open ? ' on' : '') + '" data-act="close"></div>';
    return h;
  };
  function drawer() {
    var r = R();
    return '<aside class="drawer" aria-label="Setpoint panel"><div class="dh"><span class="lbl">SETPOINT</span><button type="button" class="x" data-act="close" aria-label="Close setpoint panel">✕</button></div>' +
      '<div><h3>SAG_Ouvido_Eletronico</h3><div class="sub">ELECTRONIC EAR · % · SAG MILL · AI CONTROLLED</div></div>' +
      '<div class="cmp"><div><div class="k">ACTUAL</div><div class="a' + (r ? ' ok' : '') + '">' + (r ? '58.00' : '50.54') + '</div></div><span class="ar" aria-hidden="true">→</span><div><div class="k">AI RECOMMENDS</div><div class="t">58.00</div></div></div>' +
      '<div><div class="bandbar" style="height:20px"><div class="b" style="left:34%;width:40%"></div><div class="p" style="left:' + (r ? 52 : 20) + '%;background:' + (r ? 'var(--accent)' : 'var(--danger)') + '"></div><div class="p" style="left:52%"></div></div><div class="scale"><span>MIN 40</span><span>BAND 55–65</span><span>MAX 90</span></div></div>' +
      '<div class="why"><div class="lbl">WHY THE AI ASKS FOR THIS</div><p>Load cell sum rose 0.4% while the ear reading fell — consistent with over-filling. Raising the ear target keeps P80 in band and protects 380 t/h.</p><div class="cf"><span>CONFIDENCE 97.8%</span><span>IMPACT +3 t/h</span></div></div>' +
      '<div class="ovr"><label for="sp-v" id="sp-l">Manual override</label><div class="row"><div class="fieldval" id="sp-v" role="status" aria-labelledby="sp-l">' + f2(S.sp) + '</div><button type="button" class="step" data-act="minus" aria-label="Decrease setpoint">−</button><button type="button" class="step" data-act="plus" aria-label="Increase setpoint">+</button></div></div>' +
      '<div class="dact"><button type="button" class="btn-g" data-act="reject">Reject</button><button type="button" class="btn-p" data-act="apply"' + (r ? ' aria-disabled="true" style="opacity:.75"' : '') + '>' + (r ? '✓ Applied' : 'Apply setpoint') + '</button></div>' +
      '<div class="last"><div class="lbl">LAST CHANGES</div><div>14:26 · AI · 55.0 → 56.5 <span>auto</span></div><div>11:04 · S. Oliveira · 54.0 → 55.0 <span>manual</span></div></div></aside>';
  }

  /* histórico */
  var EV = [['08 AUG', '10:14', 'AI turned off · maintenance BL4', 'By S. Oliveira · 4h in manual · −11.6 t/h mean', 'er'], ['08 AUG', '14:20', '✓ AI resumed', 'Back in band after 2 cycles', 'ok'],
    ['10 AUG', '03:52', 'Ore blend change · zone 4B', 'Model retuned in 3 cycles, no operator action', ''], ['11 AUG', '14:02', 'Work_Index signal lost', 'Running on 17 of 18 inputs · confidence 97.8%', '']];
  T.history = function () {
    var h = chrome('history', 'SHIFT B · 14:52');
    h += '<div class="hbar">' + ['24H', '7 DAYS', '30 DAYS'].map(function (c) { return '<button type="button" class="chip" data-act="range" data-v="' + c + '" aria-pressed="' + (S.range === c) + '">' + c + '</button>'; }).join('') +
      '<button type="button" class="chip" data-act="range" data-v="CUSTOM" aria-pressed="false">CUSTOM ⌄</button><span class="sel">Throughput + P80 <span aria-hidden="true">⌄</span></span>' +
      '<button type="button" class="btn-o" data-act="csv" style="margin-left:auto;height:44px">Export CSV</button></div>';
    h += '<div class="hgrid"><div class="hcol"><div class="card hchart"><div class="hh"><span class="sec">THROUGHPUT & P80 · 05–11 AUG</span><span class="m2">DRAG TO ZOOM · CLICK A MARKER FOR THE EVENT</span></div>' +
      '<div class="chips" style="padding-bottom:8px"><button type="button" class="chip" data-act="series" data-v="t" aria-pressed="' + S.series.t + '">THROUGHPUT</button><button type="button" class="chip" data-act="series" data-v="p" aria-pressed="' + S.series.p + '">P80</button></div>' +
      '<div data-chart="hist"></div></div>' +
      '<div class="card htab"><div class="hrow h"><span>PERIOD</span><span>MEAN t/h</span><span>P80 %</span><span>DEVIATION</span><span>AI ACCURACY</span></div>' +
      '<div class="hrow"><span>AI on · 6d 20h</span><span>381.4</span><span>80.1</span><span>0.9</span><span>99.5%</span></div>' +
      '<div class="hrow off"><span>AI off · 4h</span><span>369.8</span><span>81.4</span><span>2.6</span><span>—</span></div>' +
      '<div class="hrow df"><span>Difference</span><span class="g">+11.6</span><span>−1.3</span><span>−1.7</span><span>—</span></div></div></div>' +
      '<div class="card"><div class="ph"><span class="sec">EVENTS</span><span class="m2">14 IN RANGE</span></div>' +
      EV.map(function (e, i) { return '<button type="button" class="ev ' + (e[4] === 'er' ? 'er ' : '') + (S.ev === i ? 'hl' : '') + '" data-act="ev" data-ev="' + i + '"><span class="dt">' + e[0] + '<br>' + e[1] + '</span><span><span class="ti ' + (e[4] === 'ok' ? 'ok' : '') + '" style="display:block">' + e[2] + '</span><span class="ds" style="display:block">' + e[3] + '</span></span></button>'; }).join('') +
      '<button type="button" class="more" data-act="out">Load older events</button></div></div>';
    return h;
  };

  /* relatórios */
  var REPS = [['Shift B handover', 'DRAFT', '11 AUG · 07:00–19:00 · AUTO-GENERATED'], ['Shift A handover', 'SENT', '11 AUG · 19:00–07:00'], ['Shift B handover', 'SENT', '10 AUG · 07:00–19:00'], ['Shift A handover', 'SENT', '10 AUG · 19:00–07:00']];
  T.reports = function () {
    var h = chrome('reports', 'SHIFT B · 14:52'), sent = S.sent;
    h += '<div class="rgrid"><aside class="rside"><div class="chips">' + ['SHIFT', 'MONTHLY', 'AI AUDIT'].map(function (c, i) { return '<button type="button" class="chip" data-act="rtype" aria-pressed="' + (i === 0) + '">' + c + '</button>'; }).join('') + '</div>' +
      REPS.map(function (x, i) { return '<button type="button" class="ritem" data-act="rep" data-i="' + i + '"' + (i === S.rep ? ' aria-current="true"' : '') + '><div class="t1">' + x[0] + '<span>' + (i === 0 && sent ? 'SENT' : x[1]) + '</span></div><div class="t2">' + x[2] + '</div></button>'; }).join('') +
      '<div class="sched"><div class="lbl">SCHEDULE</div><p>Shift handover is drafted automatically at 18:40 and sent when the operator signs it.</p><div class="sw"><span>Auto-draft</span><button type="button" class="tog" role="switch" aria-checked="true" aria-label="Auto-draft" data-act="tog"></button></div></div></aside>' +
      '<main class="rmain"><div class="rtop"><div><div class="lbl">PREVIEW · A4 PORTRAIT</div><h2>Shift B handover · 11 Aug 2022</h2></div><div class="acts"><button type="button" class="btn-o" data-act="newrep">New report</button><button type="button" class="btn-o" data-act="pdf">Download PDF</button><button type="button" class="btn-p" data-act="sign"' + (sent ? ' style="opacity:.75"' : '') + '>' + (sent ? '✓ Sent' : 'Sign & send') + '</button></div></div>' +
      '<article class="sheet"><div class="sh"><div><h3>Shift handover report</h3><div class="sb">CONCENTRATOR 2 · SHIFT B · 07:00–19:00 · 11 AUG 2022</div></div><div class="cl">client<br>logo</div></div>' +
      '<div class="sn">1 · SHIFT IN ONE LINE</div><p class="one">Shift closed at <b>381 t/h</b> mean throughput with P80 held at <b>80.1%</b>. AI control ran for 11h48 of 12h; the electronic ear drifted below band at 14:38 and was corrected by setpoint at 14:54. One input (Work_Index) is still offline for the next shift.</p>' +
      '<div class="rk"><div><div class="a">MEAN t/h</div><div class="b">381</div><div class="c">+1.6% vs target</div></div><div><div class="a">P80 %</div><div class="b">80.1</div><div class="c">in band 11h48</div></div><div><div class="a">AI UPTIME</div><div class="b">98%</div><div class="c">12 min manual</div></div><div><div class="a">EVENTS</div><div class="b">4</div><div class="c er">1 needs follow-up</div></div></div>' +
      '<div class="sn">2 · THROUGHPUT THROUGH THE SHIFT</div><svg viewBox="0 0 760 120" preserveAspectRatio="none" height="120" aria-hidden="true"><g stroke="var(--grid)"><path d="M0 20H760M0 60H760M0 100H760"/></g><path d="M0 86L108 80L216 74L324 70L432 62L540 74L648 52L760 44L760 120L0 120Z" fill="var(--accentSoft)"/><path d="M0 86L108 80L216 74L324 70L432 62L540 74L648 52L760 44" fill="none" stroke="var(--accent)" stroke-width="2.5" vector-effect="non-scaling-stroke"/><path d="M540 20V100" stroke="var(--danger)" stroke-dasharray="4 3" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg>' +
      '<div class="ax"><span>07:00</span><span class="er">14:38 EAR DRIFT</span><span>19:00</span></div>' +
      '<div class="sn">3 · CARRY OVER TO SHIFT A</div><div class="co"><i>▲</i><span>Work_Index sensor offline since 14:02 — instrumentation notified, model at 97.8% confidence.</span></div><div class="co"><i class="d">·</i><span>Ear setpoint left at 58.0 (manual). Review after the next blend change.</span></div><div class="co"><i class="d">·</i><span>Feed belt BL4 maintenance window closed at 14:20, no residual alarms.</span></div>' +
      '<div class="sig"><div><div class="l">SIGNED BY</div><div style="font:400 12px var(--sans);color:var(--ink);padding-top:4px">S. Oliveira · Operations</div></div><span>GENERATED 18:40 · PAGE 1 OF 2</span></div></article></main></div>';
    return h;
  };

  /* widgets */
  T.widgets = function () {
    var h = chrome('home', 'SHIFT B · 14:52');
    var rows = [['SAG_Velocidade', 'RPM', 28, 44, 56, '9.99'], ['SAG_Celula_Carga', 't', 24, 48, 62, '97.45'], ['▲ SAG_Ouvido_Eletronico', '%', 34, 40, 20, '50.54', 1], ['Work Index', 'WI', 0, 0, 0, '—', 0, 1]];
    h += '<div class="wg"><div class="card"><div class="no">01 · KPI WITH TARGET DELTA</div><div class="lbl">PRODUCTION</div><div class="v" style="display:flex;align-items:flex-end;gap:8px;padding:8px 0"><span class="big2">380</span><span class="u" style="font:400 18px var(--sans);color:var(--ink2);padding-bottom:6px">t/h</span></div><div class="range"><div class="track" aria-hidden="true"><i style="width:76%"></i></div><div class="scale"><span>0</span><span>▲ TARGET 375</span><span>500</span></div></div></div>' +
      '<div class="card"><div class="no">02 · P80 BAND, NOT A DIAL</div><div class="lbl">QUALITY P80</div><div class="v" style="display:flex;align-items:flex-end;gap:8px;padding:8px 0 10px"><span class="big2">80.1</span><span style="font:400 18px var(--sans);color:var(--ink2);padding-bottom:6px">%</span><span class="ok-t" style="font:600 13px var(--sans);padding-bottom:7px">✓ ON TARGET</span></div><div class="bandbar"><div class="b" style="left:38%;width:24%"></div><div class="p" style="left:49%"></div></div><div class="scale"><span>79.5</span><span>— 1H AGO · ▮ NOW</span><span>80.5</span></div></div>' +
      '<div class="card"><div class="no">03 · COUNTDOWN AS A BAR</div><div class="lbl">NEXT AI CYCLE</div><div class="v" style="display:flex;align-items:flex-end;gap:10px;padding:8px 0 10px"><span class="cd">00:60</span><span class="m2" style="padding-bottom:8px">until recalculation</span></div><div class="track" aria-hidden="true"><i style="width:38%"></i></div><div class="m3" style="padding-top:8px">LAST CYCLE 13:41 · ACCURACY 99.5%</div></div>' +
      '<div class="card wide"><div class="no">04 · PARAMETER ROW AS A RANGE BAR — actual, band and AI target in one line</div><div class="ptab" style="border:0">' +
      rows.map(function (x) { return '<div class="prow' + (x[6] ? ' er' : '') + (x[7] ? ' nosig' : '') + '"><div class="nm">' + x[0] + '<small>' + x[1] + '</small></div>' + (x[7] ? '<div class="rb ns">NO SIGNAL SINCE 14:02</div>' : '<div class="rb"><div class="b" style="left:' + x[2] + '%;width:' + x[3] + '%"></div><div class="p' + (x[6] ? ' x' : '') + '" style="left:' + x[4] + '%"></div></div>') + '<div class="ac' + (x[7] ? ' dash' : '') + '">' + x[5] + '</div><div class="tg dash">—</div></div>'; }).join('') + '</div></div>' +
      '<div class="card"><div class="no">05 · AI CONFIDENCE</div><div class="lbl">PREDICTION QUALITY</div><div class="v" style="display:flex;align-items:flex-end;gap:8px;padding:8px 0 10px"><span class="big2">99.5</span><span style="font:400 18px var(--sans);color:var(--ink2);padding-bottom:6px">%</span></div><div class="pq" aria-hidden="true">' + [24, 30, 34, 36, 33, 36, 36, 30].map(function (k, i) { return '<i class="' + (i === 7 ? 'on' : '') + '" style="height:' + k + 'px"></i>'; }).join('') + '</div><div class="m3" style="padding-top:8px">LAST 8 CYCLES · MIN 98.7%</div></div></div>';
    return h;
  };

  /* ---------- montagem ---------- */
  function mount(id, o) {
    o = o || {}; closeFlow(true);
    S.screen = id; var shot = T[id](); app.innerHTML = shot;
    app.setAttribute('data-screen', id);
    jump.value = NAMES[id] ? id : 'home';
    try { history.replaceState(null, '', '#' + id); } catch (e) { /* ignorar */ }
    drawCharts();
    var sv = $('#sp-v'); if (sv) sv.textContent = f2(S.sp);
    if (o.focus !== false) { app.focus({ preventScroll: true }); window.scrollTo(0, 0); say('Screen: ' + (NAMES[id] || id)); }
  }
  function again() { mount(S.screen, { focus: false }); }

  function err(input, msg) {
    var old = input.parentElement.querySelector('.perr'); if (old) old.remove();
    input.removeAttribute('aria-invalid'); input.style.borderColor = ''; if (!msg) return;
    var d = document.createElement('div'); d.className = 'perr'; d.id = input.id + '-err'; d.textContent = msg;
    input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', d.id); input.style.borderColor = 'var(--danger)'; input.insertAdjacentElement('afterend', d);
  }

  var ACT = {
    start: function () { mount('home'); },
    change: function () { toast('Changing operator is outside this prototype.'); },
    out: function () { toast('This link is outside the prototype.'); },
    signin: function () {
      var em = $('#em'), pw = $('#pw'); err(em, ''); err(pw, '');
      if (!/^\S+@\S+\.\S+$/.test(em.value)) { err(em, 'Enter a valid e-mail, like name@company.com.'); em.focus(); return; }
      if (!pw.value) { err(pw, 'Enter your password.'); pw.focus(); return; }
      mount('home');
    },
    ai: function (t) { openFlow(S.ai === 'on' ? 1 : 3, t); },
    ack: function (t) { S.acked = true; t.textContent = '✓ Acknowledged'; t.setAttribute('aria-disabled', 'true'); t.style.opacity = '.7'; toast('Alarm acknowledged. It stays open until the setpoint changes.'); },
    opencirc: function () { mount('circuits'); },
    hrange: function (t) { S.hrange = t.getAttribute('data-v'); again(); },
    view: function (t) { S.view = t.getAttribute('data-v'); again(); },
    stage: function (t) {
      var c = t.getAttribute('data-c');
      if (/stockpile/i.test(c)) { toast('The stockpile is not supervised by the AI.'); return; }
      var map = { 'primary crushing': 'Crushing', crushing: 'Crushing', 'sag mill': 'SAG mill', 'ball mill': 'Ball mill', flotation: 'Flotation' };
      S.circ = map[c.toLowerCase()] || 'SAG mill'; S.drawer = S.circ === 'SAG mill' ? S.drawer : false; mount('parameters');
    },
    circ: function (t) { S.circ = t.getAttribute('data-c'); again(); },
    row: function () { S.drawer = true; again(); },
    close: function () { S.drawer = false; again(); },
    minus: function () { S.sp = Math.max(40, Math.round((S.sp - 0.5) * 100) / 100); $('#sp-v').textContent = f2(S.sp); },
    plus: function () { S.sp = Math.min(90, Math.round((S.sp + 0.5) * 100) / 100); $('#sp-v').textContent = f2(S.sp); },
    reject: function () { S.drawer = false; again(); toast('Recommendation rejected. The setpoint stays at 50.54.'); },
    apply: function () {
      if (R()) return;
      if (S.sp < 55 || S.sp > 65) { toast('Outside the control band (55 to 65). Adjust the value to apply.'); return; }
      S.resolved = true; S.acked = true; again(); toast('Setpoint ' + f2(S.sp) + ' applied. The alarm on Home is cleared (illustrative).'); say('Setpoint applied. Alarm cleared.');
    },
    range: function (t) { var v = t.getAttribute('data-v'); if (v !== '7 DAYS') { toast('This prototype has the 7-day series only.'); return; } },
    series: function (t) { var k = t.getAttribute('data-v'); if (S.series[k] && !S.series[other(k)]) { toast('Keep at least one series visible.'); return; } S.series[k] = !S.series[k]; again(); },
    marker: function (t) { S.ev = +t.getAttribute('data-ev'); again(); var e = $('.ev.hl'); if (e && e.scrollIntoView) e.scrollIntoView({ block: 'nearest' }); },
    ev: function (t) { S.ev = +t.getAttribute('data-ev'); again(); },
    csv: function () { toast('Export simulated. Nothing is downloaded in this prototype.'); },
    rep: function (t) { S.rep = +t.getAttribute('data-i'); again(); if (S.rep) toast('Only the Shift B draft has a full preview in this prototype.'); },
    rtype: function () { toast('This prototype shows the Shift reports.'); },
    tog: function (t) { t.setAttribute('aria-checked', t.getAttribute('aria-checked') === 'true' ? 'false' : 'true'); },
    newrep: function () { toast('New report draft created (illustrative).'); },
    pdf: function () { toast('PDF download simulated.'); },
    sign: function () { if (S.sent) return; S.sent = true; again(); toast('Shift handover signed and sent (illustrative).'); }
  };
  function other(k) { return k === 't' ? 'p' : 't'; }

  app.addEventListener('click', function (e) {
    var go = e.target.closest('[data-go]'); if (go) { mount(go.getAttribute('data-go')); return; }
    var a = e.target.closest('[data-act]'); if (!a || !ACT[a.getAttribute('data-act')]) return;
    e.preventDefault(); ACT[a.getAttribute('data-act')](a);
  });
  app.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { var g = e.target.closest('g[data-act],[role=button][data-act]'); if (g && g.tagName !== 'BUTTON') { e.preventDefault(); ACT[g.getAttribute('data-act')](g); return; } }
    if (e.key === 'Enter' && e.target.closest('[data-form]') && e.target.tagName === 'INPUT') { e.preventDefault(); ACT.signin(); }
  });
  app.addEventListener('input', function (e) { if (e.target.id === 'em' || e.target.id === 'pw') err(e.target, ''); });

  /* ---------- fluxo: desligar a IA ---------- */
  function closeFlow(silent) {
    if (flowCleanup) { flowCleanup(); flowCleanup = null; }
    if (ovEl) { ovEl.remove(); ovEl = null; document.body.style.overflow = ''; }
    document.removeEventListener('keydown', onFlowKey, true);
    if (!silent && lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }
  function onFlowKey(e) {
    if (!ovEl) return;
    if (e.key === 'Escape') { e.preventDefault(); var ab = $('[data-abort]', ovEl); if (ab) ab.click(); else closeFlow(); return; }
    if (e.key === 'Tab') {
      var f = $$('button,select', ovEl); if (!f.length) return; var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  function overlay(html, label, closeLabel) {
    if (ovEl) { ovEl.remove(); ovEl = null; } if (flowCleanup) { flowCleanup(); flowCleanup = null; }
    var ov = document.createElement('div'); ov.className = 'ov'; ov.lang = 'en';
    ov.innerHTML = '<div class="ovc" role="dialog" aria-modal="true" aria-label="' + label + '">' + html + '</div><button type="button" class="ovx">' + closeLabel + '</button>';
    $('.ovx', ov).addEventListener('click', function () { var ab = $('[data-abort]', ov); if (ab) ab.click(); else closeFlow(); });
    document.body.appendChild(ov); document.body.style.overflow = 'hidden'; ovEl = ov;
    document.addEventListener('keydown', onFlowKey, true); return $('.ovc', ov);
  }
  function openFlow(step, from) { lastFocus = from || document.activeElement; if (step === 1) flow1(); else flow3(); }
  function flow1() {
    var box = overlay('<div class="fc"><div class="st">STEP 1 · CONFIRM</div><div class="tt"><span aria-hidden="true">▲</span><h3>Turn off AI control?</h3></div>' +
      '<p>18 supervised parameters return to manual setpoints immediately. Expect throughput to drop toward the 7,710 t/h baseline within one cycle.</p>' +
      '<div class="box"><div>Setpoints handed to operator<span>18</span></div><div>Estimated production impact<span>−2.1%</span></div></div>' +
      '<div class="fl2"><label for="reason">Reason (recorded in the log)</label><select id="reason"><option value="">Select a reason…</option><option>Maintenance on feed belt BL4</option><option>Sensor fault</option><option>Process upset</option><option>Other</option></select><div id="reason-err" class="perr" style="min-height:0"></div></div>' +
      '<div class="acts"><button type="button" class="btn-g" data-cancel="1">Cancel</button><button type="button" class="btn-d" id="hold" aria-describedby="hold-help"><span class="hbarf"></span><span class="hlbl">Hold to confirm</span></button></div>' +
      '<div class="hh2" id="hold-help">Press and hold for about one second. Keyboard: hold Space or Enter.</div></div>', 'Turn off AI control, step 1 of 3, confirm', 'Close');
    var hold = $('#hold', box), sel = $('#reason', box), msg = $('#reason-err', box), bar = $('.hbarf', box);
    $('[data-cancel]', box).addEventListener('click', function () { closeFlow(); });
    sel.addEventListener('change', function () { msg.textContent = ''; sel.removeAttribute('aria-invalid'); });
    var dur = 1200, raf = null, t0 = 0, holding = false;
    function reset() { holding = false; cancelAnimationFrame(raf); bar.style.width = '0'; }
    function start() {
      if (holding) return;
      if (!sel.value) { msg.textContent = 'Select a reason to continue.'; sel.setAttribute('aria-invalid', 'true'); sel.setAttribute('aria-describedby', 'reason-err'); sel.focus(); return; }
      holding = true; t0 = performance.now();
      (function tick(now) { var k = Math.min(1, ((now || performance.now()) - t0) / dur); bar.style.width = (k * 100) + '%'; if (k >= 1) { S.reason = sel.value; holding = false; flow2(); return; } raf = requestAnimationFrame(tick); })(t0);
    }
    hold.addEventListener('pointerdown', function (e) { e.preventDefault(); start(); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { hold.addEventListener(ev, reset); });
    hold.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); start(); } });
    hold.addEventListener('keyup', function (e) { if (e.key === ' ' || e.key === 'Enter') reset(); });
    flowCleanup = reset; sel.focus(); say('Turn off AI control. Step 1 of 3. Choose a reason, then hold to confirm.');
  }
  function flow2() {
    if (flowCleanup) { flowCleanup(); flowCleanup = null; }
    var box = overlay('<div class="fc"><div class="st">STEP 2 · HANDOVER IN PROGRESS</div><h3>Returning control</h3><div class="cnt" id="cnt">11 OF 18 PARAMETERS HANDED OVER</div><div class="prog" aria-hidden="true"><i id="fill" style="width:61%"></i></div>' +
      '<div><div class="hrow2">SAG_Velocidade<b>✓ manual</b></div><div class="hrow2">SAG_Celula_Carga<b>✓ manual</b></div><div class="hrow2 p">SAG_Potencia<span id="r3">handing over…</span></div><div class="hrow2 q">Throughput_Alimentacao<span id="r4">queued</span></div></div>' +
      '<div class="acts"><button type="button" class="btn-g" data-abort="1">Abort and keep AI on</button></div></div>', 'Turn off AI control, step 2 of 3, handover in progress', 'Close');
    var n = 0, cnt = $('#cnt', box), fill = $('#fill', box), r3 = $('#r3', box), r4 = $('#r4', box), ab = $('[data-abort]', box);
    var timer = setInterval(function () {
      n++; cnt.textContent = n + ' OF 18 PARAMETERS HANDED OVER'; fill.style.width = (n / 18 * 100) + '%';
      r3.textContent = n >= 14 ? '✓ manual' : 'handing over…'; r4.textContent = n >= 18 ? '✓ manual' : (n >= 14 ? 'handing over…' : 'queued');
      if (n >= 18) { clearInterval(timer); flowCleanup = null; S.ai = 'off'; say('Handover complete. AI control is off.'); flow3(true); }
    }, 220);
    flowCleanup = function () { clearInterval(timer); };
    ab.addEventListener('click', function () { clearInterval(timer); flowCleanup = null; closeFlow(); toast('Handover aborted. AI control stays on.'); });
    ab.focus(); say('Handover in progress. Step 2 of 3.');
  }
  function flow3(fromFlow) {
    if (fromFlow) again();
    var box = overlay('<div class="fc"><div class="st">STEP 3 · MANUAL MODE HOME</div><div class="manual"><b aria-hidden="true">▲</b><div><b>AI CONTROL OFF · manual since 14:52</b><span>Reason: ' + (S.reason ? S.reason.charAt(0).toLowerCase() + S.reason.slice(1) : 'maintenance on feed belt BL4') + '</span></div></div>' +
      '<div class="m2c"><div><div class="k">THROUGHPUT</div><div class="v">371 <span>t/h</span></div><div class="e">↓ −2.4% since manual</div></div><div><div class="k">PREDICTION</div><div class="v">—</div><div class="m3">UNAVAILABLE IN MANUAL</div></div></div>' +
      '<p>Prediction widgets go to an explicit unavailable state instead of showing a stale number — the failure mode most likely to mislead an operator mid-shift.</p>' +
      '<div class="foot"><span>Resume when maintenance ends</span><button type="button" class="btn-p" id="back">Turn AI back on</button></div></div>', 'Turn off AI control, step 3 of 3, manual mode', 'Continue in manual mode');
    var back = $('#back', box);
    back.addEventListener('click', function () { S.ai = 'on'; closeFlow(true); again(); toast('AI control resumed. 18 parameters are supervised again.'); });
    back.focus(); say('Manual mode. Step 3 of 3.');
  }

  /* ---------- barra do protótipo ---------- */
  jump.addEventListener('change', function () { var v = jump.value; if (v === 'flow') { mount('home'); openFlow(1); jump.value = 'flow'; } else mount(v); });
  $$('input[name="tema"]').forEach(function (r) { r.addEventListener('change', function () { setTheme(r.value); }); });
  $('#reset').addEventListener('click', function () {
    S.ai = 'on'; S.resolved = false; S.acked = false; S.sp = 58.0; S.drawer = true; S.dInit = undefined; S.circ = 'SAG mill'; S.sent = false; S.ev = -1; S.rep = 0; S.series = { t: true, p: true };
    mount('login-badge'); toast('Prototype restarted.');
  });
  var pb = $('#pbar'); if (pb && window.innerWidth >= 720) pb.setAttribute('open', '');
  var rt = null, lastW = 0;
  function onSize() { var w = app.clientWidth; if (Math.abs(w - lastW) < 2) return; lastW = w; clearTimeout(rt); rt = setTimeout(drawCharts, 60); }
  if (window.ResizeObserver) new ResizeObserver(onSize).observe(app); else window.addEventListener('resize', onSize);

  setTheme('claro');
  var st = (location.hash || '').replace('#', '');
  mount(NAMES[st] ? st : 'login-badge', { focus: false });
})();
