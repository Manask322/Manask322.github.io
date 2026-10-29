// Background music.
// Browsers only allow sound after a tap, so music starts on her first tap anywhere
// (e.g. "All aboard") and the floating ♪ button pauses / resumes it.
// If JOURNEY.music points to an mp3 that file is played; otherwise a soft,
// generated music-box tune plays (no file needed).
(function () {
  const J = window.JOURNEY;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;

  const VOLUME = 0.5;
  const btn = document.getElementById("music");
  const hint = document.getElementById("music-hint");
  let ctx, master, playing = false, started = false, source = null;

  // Remember if she turned it off, so it doesn't start again on reload
  let mutedByUser = false;
  try { mutedByUser = localStorage.getItem("journey-music") === "off"; } catch (e) {}

  function setup() {
    // iOS: play even when the ringer switch is on silent
    if (navigator.audioSession) {
      try { navigator.audioSession.type = "playback"; } catch (e) {}
    }
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    source = J.music ? fileSource() : musicBox();
  }

  // ---------- Option 1: her song, from an mp3 ----------
  function fileSource() {
    const audio = new Audio(J.music);
    audio.loop = true;
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    // route through Web Audio so the fade works on iPhone too
    ctx.createMediaElementSource(audio).connect(master);
    return { play: () => audio.play().catch(() => {}), pause: () => audio.pause() };
  }

  // ---------- Option 2: generated music box ----------
  function musicBox() {
    const out = ctx.createGain();
    out.gain.value = 0.32;
    // soft echo for a bit of room
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.34;
    const fb = ctx.createGain();
    fb.gain.value = 0.28;
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 2400;
    out.connect(master);
    out.connect(delay);
    delay.connect(tone);
    tone.connect(fb);
    fb.connect(delay);
    tone.connect(master);

    const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
    function bell(midi, t, vol, len) {
      [[1, 1], [2, 0.28], [3.01, 0.06]].forEach(([mult, amp]) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = hz(midi) * mult;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol * amp, t + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0001, t + len / mult);
        o.connect(g);
        g.connect(out);
        o.start(t);
        o.stop(t + len + 0.05);
      });
    }

    // F – C – Dm – B♭, gentle arpeggios with a simple melody on top
    const chords = [[53, 60, 65, 69], [48, 55, 60, 64], [50, 57, 62, 65], [46, 53, 58, 62]];
    const arp = [0, 1, 2, 3, 2, 1, 3, 2];
    const melody = [
      [69, 72, 77, 76], [74, 72, null, 67], [69, 72, 74, 72], [70, 69, 67, null],
      [69, 72, 77, 79], [79, 76, 72, null], [74, 77, 76, 74], [72, null, 65, null]
    ];
    const eighth = 60 / 66 / 2;
    let step = 0, next = 0, timer = null;

    function schedule() {
      while (next < ctx.currentTime + 0.3) {
        const bar = Math.floor(step / 8) % 8;
        const i = step % 8;
        bell(chords[bar % 4][arp[i]], next, 0.11, 1.6);
        if (i % 2 === 0) {
          const m = melody[bar][i / 2];
          if (m) bell(m, next, 0.2, 2.4);
        }
        next += eighth;
        step = (step + 1) % 64;
      }
    }
    return {
      play() {
        if (timer) return;
        next = ctx.currentTime + 0.1;
        schedule();
        timer = setInterval(schedule, 100);
      },
      pause() {
        clearInterval(timer);
        timer = null;
      }
    };
  }

  // ---------- controls ----------
  function play() {
    if (!ctx) setup();
    started = true;
    playing = true;
    ctx.resume();
    source.play();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(VOLUME, ctx.currentTime, 0.8); // fade in
    btn.classList.add("playing");
    btn.setAttribute("aria-pressed", "true");
    btn.setAttribute("aria-label", "Pause music");
    hint.classList.remove("show");
  }
  function pause() {
    if (!ctx) return;
    playing = false;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.25); // fade out
    setTimeout(() => { if (!playing) { source.pause(); ctx.suspend(); } }, 900);
    btn.classList.remove("playing");
    btn.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-label", "Play music");
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (playing) {
      pause();
      try { localStorage.setItem("journey-music", "off"); } catch (err) {}
    } else {
      play();
      try { localStorage.removeItem("journey-music"); } catch (err) {}
    }
  });

  // first tap anywhere starts the music (unless she switched it off before)
  function firstTouch(e) {
    if (btn.contains(e.target)) return; // the button handles its own tap
    ["pointerdown", "keydown"].forEach((ev) => window.removeEventListener(ev, firstTouch, true));
    if (!started && !mutedByUser) play();
  }
  ["pointerdown", "keydown"].forEach((ev) => window.addEventListener(ev, firstTouch, true));

  // pause while the tab is in the background, resume when she comes back
  let wasPlaying = false;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { wasPlaying = playing; if (playing) pause(); }
    else if (wasPlaying) play();
  });

  btn.hidden = false;
  if (!mutedByUser) setTimeout(() => { if (!started) hint.classList.add("show"); }, 2600);
})();
