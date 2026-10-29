(function () {
  document.documentElement.classList.add("js");

  const J = window.JOURNEY;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const parse = (s) => {
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
  const future = J.stops.filter((s) => parse(s.date) >= today);
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

  // ---- Stations ----
  const list = document.getElementById("stops");
  J.stops.forEach((s) => {
    const d = parse(s.date);
    const upcoming = d > today;
    const li = document.createElement("li");
    li.className = "stop" + (s.milestone ? " milestone" : "") + (upcoming ? " upcoming" : "");

    const photos = (s.photos || [])
      .map((p) => `<div class="photo"><img src="photos/${p}" alt="" loading="lazy" decoding="async"></div>`)
      .join("");
    const placeholder = upcoming ? "Memories coming soon" : "Add photos in journey.js";

    li.innerHTML = `
      <div class="station">${s.icon || "❤"}</div>
      <article class="card">
        <p class="date">${fmt(d)}${upcoming ? '<span class="badge">upcoming</span>' : ""}</p>
        <h2></h2>
        <p class="text"></p>
        <div class="photos">${photos || `<div class="photo-placeholder">${placeholder}</div>`}</div>
      </article>`;
    li.querySelector("h2").textContent = s.title;
    li.querySelector(".text").textContent = s.text || "";
    li.querySelectorAll(".photo img").forEach((img) => (img.alt = s.title));
    list.appendChild(li);
  });

  // Fade each photo in once it has actually loaded (no half-drawn images)
  list.querySelectorAll(".photo img").forEach((img) => {
    const done = () => img.classList.add("loaded");
    if (img.complete && img.naturalWidth) done();
    else img.addEventListener("load", done, { once: true });
  });

  // ---- Reveal stations as they scroll in ----
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
    document.querySelectorAll(".stop").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".stop").forEach((el) => el.classList.add("visible"));
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

  // ---- Lightbox (fades + scales in, tap anywhere or Esc to close) ----
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const close = () => {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
  };
  list.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
      lbImg.src = e.target.src;
      lbImg.alt = e.target.alt;
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
    }
  });
  lb.addEventListener("click", close);
  document.addEventListener("keydown", (e) => e.key === "Escape" && close());
})();
