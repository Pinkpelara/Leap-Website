
// Beam - the Leap desktop creature, website edition.
// Self-contained: paste this whole file inside a <script> tag (or load it
// with <script src>). No other assets needed.
(async function () {
  'use strict';
  if (window.__beamPet) return;
  window.__beamPet = true;
  if (window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // she sizes herself to the visitor's screen: tiny on phones, small on
  // tablets, modest on laptops, full-size only on big monitors
  var vw = window.innerWidth;
  var SIZE = vw < 480 ? 64 : vw < 768 ? 78 : vw < 1200 ? 104 : 128;
  var PHONE = vw < 768;
  var FRAMES = null;
  var _local = document.getElementById('beam-data');
  if (_local) { try { FRAMES = JSON.parse(_local.textContent); } catch (e) {} }
  if (!FRAMES) {
    try { FRAMES = JSON.parse(localStorage.getItem('__beamFrames_v1')); } catch (e) {}
  }
  if (!FRAMES) {
    try {
      var _html = await fetch('/', {credentials: 'omit'}).then(
        function (r) { return r.text(); });
      var _m = _html.match(/<script[^>]*id="beam-data"[^>]*>([\s\S]*?)<\/script>/);
      if (!_m) return;
      var _raw = _m[1].trim();
      FRAMES = JSON.parse(_raw);
      try { localStorage.setItem('__beamFrames_v1', _raw); } catch (e) {}
    } catch (e) { return; }
  }
  var SPIN = ['spin_base','spin0','spin1','spin2','spin3','spin4','spin5','spin6'];
  var BEAM_SEQ = [];
  (function () {
    function add(n, k) { for (var i = 0; i < k; i++) BEAM_SEQ.push(n); }
    add('beam_pose', 8);
    for (var l = 0; l < 2; l++) {
      add('beam_w0', 4); add('beam_w1', 4); add('beam_w2', 4); add('beam_w1', 4);
    }
    add('beam_split', 16); add('beam_w1', 4);
    add('beam_hand', 16); add('beam_pose', 8);
  })();
  var TRAMP_SEQ = [];
  (function () {
    function add(n, k) { for (var i = 0; i < k; i++) TRAMP_SEQ.push(n); }
    add('tr_stand', 6);
    add('tr_dip', 4); add('tr_up', 2); add('tr_star', 5); add('tr_fall', 2);
    add('tr_dip', 3); add('tr_up', 2); add('tr_split', 6); add('tr_fall', 2);
    add('tr_dip', 3); add('tr_up', 2); add('tr_flip1', 2); add('tr_flip2', 2);
    add('tr_flip3', 2); add('tr_star', 2); add('tr_fall', 2);
    add('tr_dip', 3); add('tr_stand', 6);
  })();

  var el = document.createElement('img');
  el.alt = 'Beam, the Leap mascot';
  el.title = 'Beam says hi! (click me)';
  el.style.cssText = 'position:fixed;left:0;bottom:0;width:' + SIZE +
    'px;height:' + SIZE + 'px;z-index:99999;cursor:pointer;' +
    'user-select:none;-webkit-user-select:none;pointer-events:auto;' +
    'image-rendering:auto;';
  el.draggable = false;
  el.src = FRAMES.idle;

  var INTRO = "Hi, I'm Beam, Leap's gym bot! \uD83E\uDD38 Tap me for a " +
    "surprise trick, or tap the \uD83E\uDD38 button in the corner to " +
    "pick from all my skills!";
  var bubble = document.createElement('div');
  bubble.textContent = INTRO;
  bubble.style.cssText = 'position:fixed;z-index:99999;background:#fff;' +
    'color:#31234f;border-radius:14px;border:2px solid #31234f;' +
    'box-shadow:0 4px 14px rgba(0,0,0,.18);opacity:0;' +
    'transition:opacity .4s;pointer-events:none;' +
    (PHONE ? 'padding:7px 10px;font:12px/1.35 system-ui,sans-serif;' +
             'max-width:58vw;'
           : 'padding:10px 14px;font:14px/1.4 system-ui,sans-serif;' +
             'max-width:240px;');
  var bubbleT = 0;
  function say(ticks, txt) {
    bubble.textContent = txt || INTRO;
    bubbleT = ticks;
    bubble.style.opacity = '1';
  }

  // trick menu: a little gymnast button that lists all her skills
  var fab = document.createElement('button');
  fab.textContent = '\uD83E\uDD38';
  fab.setAttribute('aria-label', "Beam's tricks");
  var FABS = PHONE ? 34 : 40;
  fab.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:99999;' +
    'width:' + FABS + 'px;height:' + FABS + 'px;border-radius:50%;' +
    'border:1.5px solid #31234f;background:#7c3aed;opacity:.85;' +
    'font-size:' + (PHONE ? 16 : 20) + 'px;line-height:1;cursor:pointer;' +
    'box-shadow:0 2px 8px rgba(0,0,0,.25);padding:0;';
  var menu = document.createElement('div');
  menu.style.cssText = 'position:fixed;left:8px;bottom:' + (FABS + 14) +
    'px;z-index:99999;background:#fff;border:1.5px solid #31234f;' +
    'border-radius:12px;padding:6px;display:none;' +
    'grid-template-columns:1fr 1fr;gap:4px;' +
    'box-shadow:0 6px 18px rgba(0,0,0,.25);max-width:' +
    (PHONE ? '212px' : '250px') + ';';
  [['leap', '\uD83E\uDD38 Leap!'],
   ['spin', '\uD83C\uDF00 Spin'],
   ['cartwheel', '\u2B50 Cartwheel'],
   ['split', '\uD83E\uDE70 Split'],
   ['headstand', '\uD83D\uDE43 Handstand'],
   ['bar', '\uD83C\uDFC5 Bar routine'],
   ['beamr', '\uD83C\uDFC6 Beam routine'],
   ['tramp', '\uD83C\uDFAA Trampoline'],
   ['hoop', '\uD83D\uDFE3 Hula hoop'],
   ['squish', '\uD83D\uDFE1 Squishy toy'],
   ['yoga', '\uD83E\uDDD8 Yoga'],
   ['tickle', '\uD83E\uDD2D Tickle her']].forEach(function (t) {
    var b = document.createElement('button');
    b.textContent = t[1];
    b.style.cssText = 'border:1px solid #d8d2ec;background:#f7f5fc;' +
      'border-radius:8px;color:#31234f;cursor:pointer;text-align:left;' +
      (PHONE ? 'padding:6px 8px;font:12px system-ui,sans-serif;'
             : 'padding:8px 10px;font:13px system-ui,sans-serif;');
    b.addEventListener('click', function () {
      menu.style.display = 'none';
      if (state === 'leap' || state === 'spin') return;
      if (t[0] === 'tickle') {
        setState('tickle');
        say(30, 'Hehehe!! That tickles! \uD83E\uDD2D');
      } else {
        setState(t[0]);
      }
    });
    menu.appendChild(b);
  });
  fab.addEventListener('click', function () {
    menu.style.display = menu.style.display === 'grid' ? 'none' : 'grid';
  });
  // tap anywhere else and the menu tidies itself away
  document.addEventListener('pointerdown', function (e) {
    if (menu.style.display === 'grid' && !menu.contains(e.target) &&
        e.target !== fab) {
      menu.style.display = 'none';
    }
  }, true);

  var x = Math.random() * Math.max(1, window.innerWidth - SIZE);
  var y = 0;                       // height above the bottom edge
  var vx = 0, vy = 0;
  var facing = 1;                  // 1 = right, -1 = left
  var state = 'walk', timer = 60, phase = 0;

  function xmax() { return Math.max(0, window.innerWidth - SIZE); }

  function setState(s) {
    state = s; phase = 0;
    timer = {walk: 60 + Math.random() * 90, idle: 40 + Math.random() * 50,
             leap: 999, spin: 999, land: 9,
             headstand: 35 + Math.random() * 30,
             split: 35 + Math.random() * 30,
             tickle: 26, bar: 42, hoop: 60 + Math.random() * 40,
             cartwheel: 32, yoga: 120 + Math.random() * 80,
             beamr: BEAM_SEQ.length + 8,
             tramp: TRAMP_SEQ.length + 8,
             squish: 44 + Math.random() * 26}[s];
    if (s === 'spin') { vy = 10; vx = 2.5 * facing; }
  }

  function chooseNext() {
    var r = Math.random();
    if (state !== 'walk') setState('walk');
    else if (r < 0.30) setState('idle');
    else if (r < 0.48) setState('leap');
    else if (r < 0.58) setState('spin');
    else if (r < 0.66) setState('headstand');
    else if (r < 0.74) setState('split');
    else if (r < 0.78) setState('bar');
    else if (r < 0.82) setState('beamr');
    else if (r < 0.85) setState('tramp');
    else if (r < 0.88) setState('hoop');
    else if (r < 0.91) setState('cartwheel');
    else if (r < 0.94) setState('yoga');
    else if (r < 0.96) setState('squish');
    else { facing = -facing; setState('walk'); }
  }

  function show(name, flip) {
    el.src = FRAMES[name];
    el.style.transform = (flip === false ? '' : (facing < 0 ? 'scaleX(-1)' : ''));
    el.style.left = Math.round(x) + 'px';
    el.style.bottom = Math.round(y) + 'px';
  }

  function tick() {
    var frame = 'idle';
    if (state === 'walk') {
      x += 3 * facing;
      if (x <= 0 || x >= xmax()) facing = -facing;
      frame = (Math.floor(phase / 3) % 2) ? 'walk2' : 'walk1';
    } else if (state === 'idle') {
      var c = phase % 70;
      frame = c < 4 ? 'blink' : (c >= 40 && c < 55) ? 'wave'
            : (Math.floor(phase / 10) % 2) ? 'breathe' : 'idle';
    } else if (state === 'leap') {
      if (phase < 5) frame = 'crouch';
      else if (phase === 5) { vy = 11; vx = 6 * facing; frame = 'stretch'; }
      else {
        vy -= 1.1; y += vy; x += vx;
        if (x <= 0 || x >= xmax()) { vx = -vx; facing = -facing; }
        frame = vy > -2 ? 'stretch' : 'fall';
        if (y <= 0) { y = 0; vx = vy = 0; setState('land'); }
      }
    } else if (state === 'spin') {
      vy -= 1.0; y += vy; x += vx;
      frame = SPIN[Math.floor(phase / 2) % 8];
      if (phase > 4 && y <= 0) { y = 0; vx = vy = 0; setState('land'); }
    } else if (state === 'headstand') {
      frame = 'headstand';
    } else if (state === 'split') {
      frame = 'split';
    } else if (state === 'tickle') {
      frame = (Math.floor(phase / 2) % 2) ? 'giggle2' : 'giggle1';
    } else if (state === 'hoop') {
      frame = (Math.floor(phase / 3) % 2) ? 'hoop2' : 'hoop1';
    } else if (state === 'bar') {
      frame = timer <= 5 ? 'happy' : 'bar' + (Math.floor(phase / 2) % 8);
    } else if (state === 'cartwheel') {
      x += 5 * facing;
      if (x <= 0 || x >= xmax()) facing = -facing;
      var ci = Math.floor(phase / 2) % 8;
      if (facing < 0) ci = (8 - ci) % 8;
      frame = 'cart' + ci;
    } else if (state === 'yoga') {
      var seq = ['yoga1', 'yoga2', 'yoga1', 'yoga4', 'yoga1', 'yoga3'];
      frame = seq[Math.floor(phase / 35) % 6];
    } else if (state === 'beamr') {
      frame = phase < BEAM_SEQ.length ? BEAM_SEQ[phase] : 'happy';
    } else if (state === 'tramp') {
      frame = phase < TRAMP_SEQ.length ? TRAMP_SEQ[phase] : 'happy';
    } else if (state === 'squish') {
      frame = (Math.floor(phase / 5) % 2) ? 'squish2' : 'squish1';
    } else if (state === 'land') {
      frame = timer > 5 ? 'crouch' : 'happy';
    }
    x = Math.max(0, Math.min(x, xmax()));
    phase++; timer--;
    if (timer <= 0) chooseNext();
    show(frame);
    if (bubbleT > 0) {
      bubbleT--;
      if (bubbleT === 0) bubble.style.opacity = '0';
      else {
        var bw = bubble.offsetWidth;
        bubble.style.left = Math.max(4, Math.min(
          Math.round(x + SIZE / 2 - bw / 2),
          window.innerWidth - bw - 4)) + 'px';
        bubble.style.bottom = Math.round(y + SIZE - 24) + 'px';
      }
    }
  }

  var lastPoke = 0;
  function poke() {
    if (state === 'leap' || state === 'spin') return;   // already airborne
    var now = Date.now();
    var rapid = now - lastPoke < 700;
    lastPoke = now;
    if (rapid) {                                        // she's ticklish!
      setState('tickle');
      say(30, 'Hehehe!! That tickles! \uD83E\uDD2D');
      return;
    }
    var r = Math.random();
    if (r < 0.16) setState('leap');
    else if (r < 0.3) setState('spin');
    else if (r < 0.42) setState('split');
    else if (r < 0.52) setState('headstand');
    else if (r < 0.62) setState('bar');
    else if (r < 0.72) setState('beamr');
    else if (r < 0.82) setState('tramp');
    else if (r < 0.89) setState('hoop');
    else if (r < 0.95) setState('cartwheel');
    else setState('squish');
  }
  // pointerdown fires the moment a finger/cursor touches her - taps land
  // even while she's walking (click waits for release, by which time she
  // has strolled out from under the finger)
  if (window.PointerEvent) {
    el.addEventListener('pointerdown', poke);
  } else {
    el.addEventListener('touchstart', poke, {passive: true});
    el.addEventListener('click', poke);
  }

  function start() {
    document.body.appendChild(el);
    document.body.appendChild(bubble);
    document.body.appendChild(fab);
    document.body.appendChild(menu);
    setState('walk');
    setInterval(tick, 60);
    var greeted = false;
    try { greeted = !!sessionStorage.getItem('beamHi'); } catch (e) {}
    if (!greeted) {
      try { sessionStorage.setItem('beamHi', '1'); } catch (e) {}
      setTimeout(function () { say(140); }, 900);
    }
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', start);
  else start();
})();
