(function () {
  const J = window.JOURNEY;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  // ---- Countdown to the next milestone (or next stop) ----
  const future = J.stops.filter((s) => parse(s.date) >= today);
  const next = future.find((s) => s.milestone) || future[0];
  if (next) {
    const n = daysBetween(today, parse(next.date));
    const cd = document.getElementById("countdown");
    cd.innerHTML =
      n === 0
        ? `<strong>Today!</strong>${next.title}`
        : `<strong>${n} day${n === 1 ? "" : "s"}</strong>until ${next.title}`;
    cd.hidden = false;
  }

  // ---- Stations ----
  const list = document.getElementById("stops");
  J.stops.forEach((s) => {
    const d = parse(s.date);
    const upcoming = d > today;
    const li = document.createElement("li");
    li.className = "stop" + (s.milestone ? " milestone" : "") + (upcoming ? " upcoming" : "");

    const photos = (s.photos || [])
      .map((p) => `<img src="photos/${p}" alt="${s.title}" loading="lazy">`)
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
    list.appendChild(li);
  });

  // ---- Reveal stations as they scroll in ----
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
    { threshold: 0.15 }
  );
  document.querySelectorAll(".stop").forEach((el) => io.observe(el));

  // ---- Train moves along the track with scroll ----
  const line = document.getElementById("line");
  const train = document.getElementById("train");
  function moveTrain() {
    const r = line.getBoundingClientRect();
    const progress = (window.innerHeight * 0.5 - r.top) / r.height;
    const clamped = Math.max(0, Math.min(1, progress));
    train.style.top = clamped * (line.offsetHeight - 40) + "px";
  }
  window.addEventListener("scroll", moveTrain, { passive: true });
  window.addEventListener("resize", moveTrain);
  moveTrain();

  // ---- Lightbox ----
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  list.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
      lbImg.src = e.target.src;
      lb.hidden = false;
    }
  });
  lb.addEventListener("click", () => (lb.hidden = true));
  document.addEventListener("keydown", (e) => e.key === "Escape" && (lb.hidden = true));
})();
