(function () {
  document.documentElement.classList.add("js");

  const J = window.JOURNEY;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const parse = (s) => {
    if (!s) return null;
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  const fmt = (d) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const daysBetween = (a, b) => Math.round((b - a) / 86400000);

  // ---- Header ----
  document.title = J.title;
  document.getElementById("title").textContent = J.title;
  document.getElementById("subtitle").textContent = J.subtitle;
  const bday = document.getElementById("birthday");
  bday.textContent = J.birthdayNote || "";
  bday.hidden = !J.birthdayNote;
  document.getElementById("footer").textContent = `${J.me} ❤ ${J.her}`;

  // ---- Countdown to the next milestone (or next stop), counting up on load ----
  const future = J.stops.filter((s) => s.date && parse(s.date) >= today);
  const next = future.find((s) => s.milestone) || future[0];
  if (next) {
    const n = daysBetween(today, parse(next.date));
    const cd = document.getElementById("countdown");
    cd.hidden = false;
    if (n === 0) {
      cd.innerHTML = `<strong>Today!</strong>`;
      cd.append(next.title);
    } else {
      cd.innerHTML = `<strong>0 days</strong>until `;
      cd.append(next.title);
      const num = cd.querySelector("strong");
      const label = (v) => `${v} day${v === 1 ? "" : "s"}`;
      if (reduceMotion) {
        num.textContent = label(n);
      } else {
        const start = performance.now() + 700, dur = 1400;
        const tick = (t) => {
          const p = Math.min(1, Math.max(0, (t - start) / dur));
          num.textContent = label(Math.round(n * (1 - Math.pow(1 - p, 4))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }
  }

  // ---- Falling petals & hearts in the background ----
  if (!reduceMotion) {
    const petals = document.getElementById("petals");
    const shapes = ["❤", "✿", "❀", "❤", "✦"];
    const count = window.innerWidth < 600 ? 9 : 16;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "petal";
      const inner = document.createElement("span");
      inner.textContent = shapes[i % shapes.length];
      const size = 10 + Math.random() * 12;
      const fall = 16 + Math.random() * 18;
      el.style.left = Math.random() * 100 + "vw";
      el.style.animationDuration = fall + "s";
      el.style.animationDelay = -Math.random() * fall + "s";
      inner.style.fontSize = size + "px";
      inner.style.opacity = (0.18 + Math.random() * 0.3).toFixed(2);
      inner.style.animationDuration = 2.5 + Math.random() * 3 + "s";
      if (i % 3 === 1) inner.style.color = "#c9a24a";
      el.appendChild(inner);
      petals.appendChild(el);
    }
  }

  // ---- Stations, little polaroid moments and letters ----
  const list = document.getElementById("stops");
  // "first_trip" → photos/first_trip-t.jpg (grid) + photos/first_trip.jpg (full screen)
  const src = (p) => (/\.\w+$/.test(p) ? [`photos/${p}`, `photos/${p}`] : [`photos/${p}-t.jpg`, `photos/${p}.jpg`]);
  const imgTag = (p) => {
    const [thumb, full] = src(p);
    return `<img src="${thumb}" data-full="${full}" alt="" loading="lazy" decoding="async">`;
  };
  let side = "left";

  J.stops.forEach((s) => {
    // polaroids between stations, on the empty side of the track
    if (s.misc) {
      const li = document.createElement("li");
      li.className = "interlude " + side; // the empty side beside the previous card
      li.innerHTML = s.misc.map((p) => `<figure class="polaroid">${imgTag(p)}</figure>`).join("");
      li.querySelectorAll("img").forEach((img) => (img.alt = "A little moment"));
      list.appendChild(li);
      return;
    }

    const d = parse(s.date);
    const upcoming = !!d && d > today;
    const li = document.createElement("li");
    li.className = `stop ${side}` + (s.milestone ? " milestone" : "") + (upcoming ? " upcoming" : "") + (s.blank ? " blank" : "");
    side = side === "left" ? "right" : "left";

    const photos = (s.photos || []).map((p) => `<div class="photo">${imgTag(p)}</div>`).join("");
    const count = (s.photos || []).length;
    const daysLeft = upcoming ? daysBetween(today, d) : 0;
    const inDays = (n) => (n === 1 ? "Tomorrow!" : `in ${n} days`);
    // no photos yet: blank pages keep their empty frame, upcoming stops get a
    // countdown tile, past stops simply show no photo area
    let media = photos;
    if (!media && s.blank) media = `<div class="photo-placeholder">A photo we haven't taken yet</div>`;
    else if (!media && upcoming)
      media = `<div class="soon"><span class="soon-icon">${s.icon || "❤"}</span><span class="soon-days">${inDays(daysLeft)}</span><span class="soon-note">${s.milestone ? "Photos coming soon" : "Coming up"}</span></div>`;
    const dateText = s.dateLabel ? s.dateLabel : d ? fmt(d) : s.blank ? "Date: yet to be written" : "Date to add";

    li.innerHTML = `
      <div class="station">${s.icon || "❤"}</div>
      <article class="card">
        <p class="date">${dateText}${upcoming ? '<span class="badge">upcoming</span>' : ""}</p>
        <h2></h2>
        ${s.text ? '<p class="text"></p>' : ""}
        ${media ? `<div class="photos${count === 1 || !photos ? " single" : ""}">${media}</div>` : ""}
      </article>`;
    li.querySelector("h2").textContent = s.title;
    if (s.text) li.querySelector(".text").textContent = s.text;
    li.querySelectorAll(".photo img").forEach((img) => (img.alt = s.title));
    li._stop = s;
    li._daysLeft = daysLeft;
    if (s.milestone) li.querySelector(".card").addEventListener("click", (e) => {
      if (e.target.tagName !== "IMG") celebrate(li);
    });
    list.appendChild(li);

    // an envelope on the track right after this stop
    if (s.letter) {
      const env = document.createElement("li");
      env.className = "letter-stop";
      env.innerHTML = `
        <button class="envelope" type="button" aria-label="Open the letter: ${s.title.replace(/"/g, "")}">
          <svg viewBox="0 0 48 34" aria-hidden="true">
            <rect x="1.5" y="1.5" width="45" height="31" rx="4" fill="#fffaf2" stroke="#c9a24a" stroke-width="2"/>
            <path d="M3 4l21 15L45 4" fill="none" stroke="#c9a24a" stroke-width="2" stroke-linejoin="round"/>
            <circle cx="24" cy="19" r="6" fill="#c8566b"/>
            <path d="M24 22.2c-2.3-1.7-3.4-2.9-3.4-4.1a1.7 1.7 0 0 1 3.4-.5 1.7 1.7 0 0 1 3.4.5c0 1.2-1.1 2.4-3.4 4.1z" fill="#fff"/>
          </svg>
        </button>
        <span class="letter-label">A letter for you</span>`;
      env._letter = s;
      env.querySelector(".envelope").addEventListener("click", () => openLetter(s));
      list.appendChild(env);
    }
  });

  // Fade each photo in once it has actually loaded (no half-drawn images)
  list.querySelectorAll("img").forEach((img) => {
    const done = () => img.classList.add("loaded");
    if (img.complete && img.naturalWidth) done();
    else img.addEventListener("load", done, { once: true });
  });

  // ---- Reveal as they scroll in ----
  const revealables = document.querySelectorAll(".stop, .interlude, .letter-stop");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("visible"));
  }

  // ---- Letters: open by themselves once she scrolls past the envelope ----
  const lm = document.getElementById("letter");
  const lmTitle = document.getElementById("letter-title");
  const lmText = document.getElementById("letter-text");
  let letterTimers = [], closeTimer = null;
  const autoOpened = new Set();

  function openLetter(s) {
    if (lm.classList.contains("open") && !lm.classList.contains("closing")) return;
    clearTimeout(closeTimer);
    letterTimers.forEach(clearTimeout);
    lm.classList.remove("open", "flap", "peek", "read", "closing");
    lmTitle.textContent = s.title;
    lmText.textContent = s.letter;
    lm.querySelector(".lm-paper").scrollTop = 0;
    document.body.classList.add("no-scroll");
    lm.setAttribute("aria-hidden", "false");
    lm.classList.add("open");                                       // envelope pops in
    letterTimers.push(setTimeout(() => lm.classList.add("flap"), reduceMotion ? 0 : 650));    // flap lifts
    letterTimers.push(setTimeout(() => lm.classList.add("peek"), reduceMotion ? 0 : 1150));   // letter slides out
    letterTimers.push(setTimeout(() => {                            // letter unfolds into the card
      lm.classList.add("read");
      lm.querySelector(".lm-close").focus({ preventScroll: true });
    }, reduceMotion ? 0 : 1750));
  }
  function closeLetter() {
    if (!lm.classList.contains("open") || lm.classList.contains("closing")) return;
    letterTimers.forEach(clearTimeout);
    lm.classList.add("closing");
    closeTimer = setTimeout(() => {
      lm.classList.remove("open", "flap", "peek", "read", "closing");
      lm.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
    }, 450);
  }
  lm.querySelector(".lm-close").addEventListener("click", closeLetter);
  lm.addEventListener("click", (e) => { if (e.target === lm) closeLetter(); });
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeLetter());

  if ("IntersectionObserver" in window) {
    const letterIO = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          // open only when the envelope moves from below to above the 40% line,
          // i.e. she has just scrolled past that step (not on a reload mid-page)
          const li = e.target;
          const above = !e.isIntersecting && e.boundingClientRect.top < window.innerHeight * 0.4;
          const wasAbove = li._above;
          li._above = above;
          if (above && wasAbove === false) {
            if (autoOpened.has(li)) return;
            autoOpened.add(li);
            letterIO.unobserve(li);
            if (!lm.classList.contains("open") && !document.getElementById("lightbox").classList.contains("open")) {
              openLetter(li._letter);
            }
          }
        }),
      { rootMargin: "-40% 0px 0px 0px" }
    );
    document.querySelectorAll(".letter-stop").forEach((el) => letterIO.observe(el));
  }

  // ---- Fireworks when a milestone (engagement, wedding) reaches the middle of the screen ----
  const fireworks = (() => {
    const canvas = document.getElementById("fireworks");
    const ctx = canvas.getContext("2d");
    // deep, saturated colours so bursts read clearly on the light background
    const colors = ["#d6335a", "#e0a100", "#ff6b4a", "#b5179e", "#7b4fd6", "#e8546f", "#f08c00"];
    const confettiColors = ["#d6335a", "#e0a100", "#ff6b4a", "#7b4fd6", "#2bb5a0", "#f2c94c", "#e8546f", "#4a90e2"];
    const small = window.innerWidth < 600;
    let rockets = [], sparks = [], confetti = [], running = false, last = 0, w = 0, h = 0;

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener("resize", size);
    size();

    const pick = (arr) => arr[(Math.random() * arr.length) | 0];

    // ----- fireworks -----
    function explode(x, y, heart) {
      const c1 = pick(colors), c2 = pick(colors);
      const n = heart ? 80 : small ? 55 : 80;
      const power = small ? 0.8 : 1;
      for (let i = 0; i < n; i++) {
        let vx, vy;
        if (heart) {
          // heart curve: x = 16 sin³t, y = 13cos t − 5cos 2t − 2cos 3t − cos 4t
          const t = (i / n) * Math.PI * 2;
          vx = 16 * Math.pow(Math.sin(t), 3) * 0.3 * power;
          vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.3 * power;
        } else {
          const ang = Math.random() * Math.PI * 2, sp = (2 + Math.random() * 5) * power;
          vx = Math.cos(ang) * sp; vy = Math.sin(ang) * sp;
        }
        sparks.push({
          x, y, vx, vy, life: 1,
          decay: 0.009 + Math.random() * 0.01,
          color: heart ? "#e0284f" : i % 2 ? c1 : c2,
          width: 1.8 + Math.random() * 1.4
        });
      }
    }

    function launch(delay, heart) {
      setTimeout(() => {
        const startY = h + 10;
        const targetY = h * (0.15 + Math.random() * 0.25);
        // launch speed that tops out right around targetY (v² = 2·g·d)
        const vy = -Math.sqrt(2 * 0.14 * (startY - targetY));
        rockets.push({ x: w * (0.15 + Math.random() * 0.7), y: startY, vx: (Math.random() - 0.5) * 1.2, vy, heart });
        start();
      }, delay);
    }

    // ----- party poppers: paper confetti shot from the bottom corners -----
    function popper(fromLeft, delay) {
      setTimeout(() => {
        const n = small ? 55 : 90;
        const x = fromLeft ? 0 : w, y = h;
        for (let i = 0; i < n; i++) {
          // aim up and inwards, ~60° ± 15° from the floor
          const ang = (-60 + (Math.random() - 0.5) * 30) * (Math.PI / 180);
          // with air drag, distance ≈ speed / 0.045 → reach 40–75% of the screen height
          const sp = h * (0.018 + Math.random() * 0.016);
          confetti.push({
            x, y,
            vx: Math.cos(ang) * sp * (fromLeft ? 1 : -1),
            vy: Math.sin(ang) * sp,
            rot: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.4,
            flip: Math.random() * Math.PI * 2,
            flipSpeed: 0.08 + Math.random() * 0.12,
            w: 6 + Math.random() * 6,
            h: 3 + Math.random() * 3,
            color: pick(confettiColors),
            round: Math.random() < 0.2,
            life: 1
          });
        }
        start();
      }, delay);
    }

    function streak(x, y, vx, vy, len) {
      ctx.beginPath();
      ctx.moveTo(x - vx * len, y - vy * len);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    function frame(now) {
      // time-based: same speed at 30, 60 or 120 fps (k = 1 at 60fps)
      const k = Math.min(3, (now - last) / 16.67 || 1);
      last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";

      rockets = rockets.filter((r) => {
        r.x += r.vx * k; r.y += r.vy * k; r.vy += 0.14 * k;
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = "#e0a100";
        ctx.lineWidth = 2.5;
        streak(r.x, r.y, r.vx, r.vy, 3);
        if (r.vy >= -0.5) { explode(r.x, r.y, r.heart); return false; }
        return true;
      });

      const drag = Math.pow(0.965, k);
      sparks = sparks.filter((p) => {
        p.vx *= drag; p.vy = p.vy * drag + 0.05 * k;
        p.x += p.vx * k; p.y += p.vy * k;
        p.life -= p.decay * k;
        if (p.life <= 0) return false;
        ctx.globalAlpha = Math.min(1, p.life * 1.6) * (0.75 + Math.random() * 0.25); // twinkle
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.width * Math.max(0.4, p.life);
        streak(p.x, p.y, p.vx, p.vy, 2.6);
        return true;
      });

      const airDrag = Math.pow(0.955, k);
      confetti = confetti.filter((c) => {
        c.vx *= airDrag;
        c.vy = c.vy * airDrag + 0.22 * k;
        if (c.vy > 2.2) c.vy = 2.2;                  // paper floats down slowly
        c.x += (c.vx + Math.sin(c.flip) * 0.6) * k;  // flutter sideways
        c.y += c.vy * k;
        c.rot += c.spin * k;
        c.flip += c.flipSpeed * k;
        if (c.y > h + 20) return false;
        if (c.vy > 0) c.life -= 0.004 * k;
        if (c.life <= 0) return false;
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.scale(1, Math.cos(c.flip));              // the paper turning over
        ctx.globalAlpha = Math.min(1, c.life * 2);
        ctx.fillStyle = c.color;
        if (c.round) { ctx.beginPath(); ctx.arc(0, 0, c.h, 0, Math.PI * 2); ctx.fill(); }
        else ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
        return true;
      });
      ctx.globalAlpha = 1;

      if (rockets.length || sparks.length || confetti.length) requestAnimationFrame(frame);
      else { running = false; ctx.clearRect(0, 0, w, h); }
    }
    function start() {
      if (!running) {
        running = true;
        last = performance.now();
        requestAnimationFrame(frame);
      }
    }

    return function show() {
      popper(true, 0);
      popper(false, 120);
      const count = small ? 5 : 8;
      for (let i = 0; i < count; i++) launch(300 + i * 300 + Math.random() * 200, false);
      launch(300 + count * 150, true); // one heart in the middle of the show
      popper(true, 1800);
      popper(false, 1950);
    };
  })();

  // ---- Milestone celebration: big card over the screen + fireworks + poppers ----
  const cb = document.getElementById("celebrate");
  let cbTimer = null;
  function celebrate(li) {
    const st = li._stop;
    const n = li._daysLeft;
    cb.querySelector(".cb-icon").textContent = st.icon || "❤";
    cb.querySelector(".cb-date").textContent = st.dateLabel || fmt(parse(st.date));
    cb.querySelector(".cb-title").textContent = st.title;
    cb.querySelector(".cb-count").textContent =
      n > 1 ? `${n} days to go` : n === 1 ? "Tomorrow!" : parse(st.date) && parse(st.date).getTime() === today.getTime() ? "Today!" : "";
    cb.querySelector(".cb-text").textContent = st.text || "";
    clearTimeout(cbTimer);
    cb.classList.remove("closing");
    cb.setAttribute("aria-hidden", "false");
    cb.classList.add("open");
    document.body.classList.add("no-scroll");
    if (!reduceMotion) setTimeout(fireworks, 250);
  }
  function closeCelebration() {
    if (!cb.classList.contains("open")) return;
    cb.classList.add("closing");
    cbTimer = setTimeout(() => {
      cb.classList.remove("open", "closing");
      cb.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
    }, 500);
  }
  cb.addEventListener("click", closeCelebration);
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeCelebration());

  if ("IntersectionObserver" in window) {
    const celebrated = new Set();
    const cbObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const li = e.target.closest(".stop");
          if (celebrated.has(li) || lm.classList.contains("open")) return;
          celebrated.add(li);
          celebrate(li);
        }),
      { rootMargin: "-40% 0px -40% 0px" }
    );
    document.querySelectorAll(".stop.milestone .station").forEach((el) => cbObserver.observe(el));
  }

  // ---- Train glides along the track (rAF + lerp, transform only) ----
  const line = document.getElementById("line");
  const train = document.getElementById("train");
  const trail = document.getElementById("trail");
  let target = 0, current = 0, running = false, lineTop = 0, lineHeight = 1;

  function measure() {
    lineTop = line.getBoundingClientRect().top + window.scrollY;
    lineHeight = line.offsetHeight;
  }
  function computeTarget() {
    const progress = (window.scrollY + window.innerHeight * 0.5 - lineTop) / lineHeight;
    target = Math.max(0, Math.min(1, progress));
  }
  function render() {
    current += (target - current) * (reduceMotion ? 1 : 0.12);
    if (Math.abs(target - current) < 0.0005) current = target;
    const th = train.offsetHeight;
    const y = current * (lineHeight - th);
    train.style.transform = `translate3d(0, ${y}px, 0)`;
    trail.style.transform = `scaleY(${(y + th / 2) / lineHeight})`;
    if (current !== target) requestAnimationFrame(render);
    else running = false;
  }
  function onScroll() {
    computeTarget();
    if (!running) {
      running = true;
      requestAnimationFrame(render);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { measure(); onScroll(); });
  window.addEventListener("load", () => { measure(); onScroll(); });
  if ("ResizeObserver" in window) new ResizeObserver(() => { measure(); onScroll(); }).observe(line);
  measure();
  onScroll();

  // ---- Lightbox: tap a photo, swipe / arrows to move through all photos ----
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const gallery = Array.from(list.querySelectorAll("img"));
  let photoIndex = 0;
  function showPhoto(i) {
    photoIndex = (i + gallery.length) % gallery.length;
    const img = gallery[photoIndex];
    lbImg.classList.remove("in");
    lbImg.src = img.dataset.full || img.src;
    lbImg.alt = img.alt;
    requestAnimationFrame(() => requestAnimationFrame(() => lbImg.classList.add("in")));
  }
  const closeLb = () => {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
  };
  list.addEventListener("click", (e) => {
    const i = gallery.indexOf(e.target);
    if (i < 0) return;
    lbImg.src = e.target.src; // show the thumbnail instantly, swap to full size
    showPhoto(i);
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
  });
  lb.querySelector(".lb-prev").addEventListener("click", (e) => { e.stopPropagation(); showPhoto(photoIndex - 1); });
  lb.querySelector(".lb-next").addEventListener("click", (e) => { e.stopPropagation(); showPhoto(photoIndex + 1); });
  lb.addEventListener("click", closeLb);
  let touchX = null;
  lb.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 50) {
      e.preventDefault(); // a swipe, not a tap → don't close
      showPhoto(photoIndex + (dx < 0 ? 1 : -1));
    }
  });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowRight") showPhoto(photoIndex + 1);
    if (e.key === "ArrowLeft") showPhoto(photoIndex - 1);
  });
})();
