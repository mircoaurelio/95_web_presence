/* ============================================================
   NINETYFIVE — coming soon / opening pass
   ============================================================ */

(function openingPass() {
  const KEY_PLAYER = "nf-opening-player";
  const KEY_DONE = "nf-opening-complete";
  const KEY_SCREEN = "nf-opening-screen";
  const IG_URL = "https://www.instagram.com/ninetyfiveburgers/";

  const screens = {
    load: document.querySelector('[data-screen="load"]'),
    welcome: document.querySelector('[data-screen="welcome"]'),
    player: document.querySelector('[data-screen="player"]'),
    join: document.querySelector('[data-screen="join"]'),
  };
  if (!screens.load || !screens.welcome || !screens.player || !screens.join) return;

  const dots = [...document.querySelectorAll(".load-dots span")];
  const pctEl = document.querySelector("[data-load-pct]");
  const barEl = document.querySelector("[data-load-bar]");
  const form = document.getElementById("playerForm");
  const errorEl = document.getElementById("formError");
  const startBtn = document.querySelector("[data-start-game]");
  const unlockBtn = document.querySelector("[data-unlock-pass]");
  const igLink = document.querySelector("[data-ig-follow]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function show(name) {
    Object.entries(screens).forEach(([key, el]) => {
      const on = key === name;
      el.classList.toggle("is-on", on);
      el.hidden = !on;
    });
    if (name !== "load") sessionStorage.setItem(KEY_SCREEN, name);
  }

  function fillForm(data) {
    if (!form || !data) return;
    form.elements.namedItem("name").value = data.name || "";
    form.elements.namedItem("email").value = data.email || "";
    form.elements.namedItem("instagram").value = data.instagram || "";
  }

  function readPlayer() {
    try {
      return JSON.parse(sessionStorage.getItem(KEY_PLAYER) || "null");
    } catch (_) {
      return null;
    }
  }

  function normalizeInstagram(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    return raw.startsWith("@") ? raw : "@" + raw.replace(/^@+/, "");
  }

  function validate(data) {
    const name = data.name.trim();
    const email = data.email.trim();
    const ig = data.instagram.trim();
    if (!name || name.length < 2) return "Inserisci nome e cognome.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Inserisci un'email valida.";
    if (!/^@?[A-Za-z0-9._]{1,30}$/.test(ig)) return "Inserisci un username Instagram valido.";
    return "";
  }

  function setProgress(value) {
    const pct = Math.max(0, Math.min(100, value));
    const shown = Math.round(pct);
    if (pctEl) pctEl.textContent = shown + "%";
    if (barEl) barEl.setAttribute("aria-valuenow", String(shown));
    if (!dots.length) return;
    const n = dots.length;
    dots.forEach((dot, i) => {
      const start = (i / n) * 100;
      const end = ((i + 1) / n) * 100;
      dot.classList.toggle("is-on", pct >= end - 0.05);
      dot.classList.toggle("is-partial", pct > start && pct < end - 0.05);
    });
  }

  function animateProgress(from, to, duration) {
    return new Promise((resolve) => {
      if (duration <= 0) {
        setProgress(to);
        resolve();
        return;
      }
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - t) * (1 - t);
        setProgress(from + (to - from) * eased);
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function runLoading() {
    show("load");
    setProgress(0);
    if (reduceMotion || !dots.length) {
      setProgress(100);
      show("welcome");
      return;
    }
    (async () => {
      await wait(160);
      await animateProgress(0, 95, 1500);
      await wait(1200);
      await animateProgress(95, 100, 280);
      await wait(260);
      show("welcome");
    })();
  }

  const savedScreen = sessionStorage.getItem(KEY_SCREEN);
  const savedPlayer = readPlayer();
  fillForm(savedPlayer);

  if (savedScreen === "player" || savedScreen === "join" || savedScreen === "welcome") {
    if (savedScreen === "join" && !savedPlayer) show("player");
    else show(savedScreen);
  } else {
    runLoading();
  }

  startBtn?.addEventListener("click", () => show("player"));

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = {
      name: form.elements.namedItem("name").value,
      email: form.elements.namedItem("email").value,
      instagram: normalizeInstagram(form.elements.namedItem("instagram").value),
    };
    const message = validate(data);
    if (message) {
      if (errorEl) errorEl.textContent = message;
      return;
    }
    if (errorEl) errorEl.textContent = "";
    form.elements.namedItem("instagram").value = data.instagram;
    sessionStorage.setItem(KEY_PLAYER, JSON.stringify(data));
    show("join");
  });

  igLink?.addEventListener("click", () => {
    sessionStorage.setItem("nf-opening-ig-clicked", "1");
  });
  if (igLink) igLink.setAttribute("href", IG_URL);

  unlockBtn?.addEventListener("click", () => {
    const data = readPlayer();
    if (!data || validate(data)) {
      show("player");
      if (errorEl) errorEl.textContent = "Completa prima la missione 01.";
      return;
    }
    sessionStorage.setItem(KEY_DONE, "1");
    window.location.href = "grazie/";
  });
})();
