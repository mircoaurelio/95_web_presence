/* ============================================================
   NINETYFIVE — script del sito
   ============================================================ */

/* ---------- Hero: macchina da scrivere sotto "House of" ---------- */
(function heroTypewriter() {
  const el = document.querySelector(".hero__rotator");
  if (!el) return;

  const words = [
    "Butter Burgers",
    "Foil wraps",
    "Road songs",
    "Extra napkins",
    "95 Sauce",
    "Late drives",
    "Double patties",
    "Burger Fries",
    "Sticker bombs",
    "Coming back",
  ];

  const TYPE = 72;
  const DELETE = 42;
  const HOLD = 1800;
  const GAP = 380;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let i = 0;
  let char = 0;
  let deleting = false;

  function tick() {
    const word = words[i];
    if (!deleting) {
      char += 1;
      el.textContent = word.slice(0, char);
      if (char === word.length) {
        deleting = true;
        setTimeout(tick, HOLD);
        return;
      }
      setTimeout(tick, TYPE);
    } else {
      char -= 1;
      el.textContent = word.slice(0, char);
      if (char === 0) {
        deleting = false;
        i = (i + 1) % words.length;
        setTimeout(tick, GAP);
        return;
      }
      setTimeout(tick, DELETE);
    }
  }

  el.textContent = words[0];
  char = words[0].length;
  deleting = true;
  setTimeout(tick, HOLD);
})();

/* ---------- Stickers: layer frontale, fluttuanti, draggabili da desktop ---------- */
(function stickersPlay() {
  const layer = document.querySelector(".stickers");
  if (!layer) return;

  const desktop = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)");

  function bindDrag(el) {
    let ox = 0;
    let oy = 0;

    el.addEventListener("pointerdown", (e) => {
      if (!desktop.matches || e.button !== 0) return;
      const r = el.getBoundingClientRect();
      ox = e.clientX - r.left;
      oy = e.clientY - r.top;
      el.classList.add("is-dragging");
      el.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    el.addEventListener("pointermove", (e) => {
      if (!el.classList.contains("is-dragging")) return;
      const parent = layer.getBoundingClientRect();
      el.style.left = `${e.clientX - parent.left - ox}px`;
      el.style.top = `${e.clientY - parent.top - oy}px`;
      el.style.right = "auto";
      el.style.bottom = "auto";
    });

    function release() {
      el.classList.remove("is-dragging");
    }

    el.addEventListener("pointerup", release);
    el.addEventListener("pointercancel", release);
  }

  layer.querySelectorAll(".sticker").forEach(bindDrag);
})();

/* ---------- Combo: "Make it Burger Fries" → banner scuro + prezzi +5 ---------- */
(function comboUpgrade() {
  const combo = document.querySelector(".combo");
  const makeBar = document.querySelector(".combo__bar--make");
  if (!combo || !makeBar) return;

  if (window.matchMedia("(hover: none)").matches) {
    makeBar.setAttribute("role", "button");
    makeBar.setAttribute("tabindex", "0");
    makeBar.style.cursor = "pointer";
    makeBar.addEventListener("click", () => combo.classList.toggle("is-upgraded"));
    return;
  }

  makeBar.addEventListener("mouseenter", () => combo.classList.add("is-upgraded"));
  makeBar.addEventListener("mouseleave", () => combo.classList.remove("is-upgraded"));
})();

/* ---------- Menù: palco a tutto schermo, scroll → rotazione + cambio alimento ---------- */
(function burgerCarousel() {
  const pin = document.getElementById("burgerPin");
  const showcase = document.querySelector(".burger-showcase");
  const root = document.getElementById("burgerCarousel");
  const modal = document.getElementById("receiptModal");
  const modalBody = document.getElementById("receiptModalBody");
  if (!pin || !showcase || !root) return;

  const ANGLES = 5;
  const BURGERS = [
    { key: "butter", title: "Butter Burger", seal: "assets/seal-butter-burger.svg",
      photos: ["assets/burger-butter.png", "assets/burger-butter-2.png", "assets/burger-butter-3.png", "assets/burger-butter-4.png", "assets/burger-butter-5.png"],
      btn: "counter", total: "10", order: "ORDER #BB095", note: "NO DELIVERY - COUNTER ONLY",
      items: [["DOUBLE PATTY", "Fresh prime ground beef"], ["CHEESE", "Double white cheddar"], ["ONIONS", "Butter-grilled onions"], ["PICKLES", "Included"], ["BUN", "Potato Bun"], ["BUTTER", "Soft butter"]],
      foot: ["Counter Order", "Plate + napkin + wipe"], tag: "Butter is better!", rot: "2deg", dx: "0px", dy: "0px" },
    { key: "bacon", title: "Bacon Burger", seal: "assets/seal-bacon.svg",
      photos: ["assets/burger-bacon.png", "assets/burger-bacon-2.png", "assets/burger-bacon-3.png", "assets/burger-bacon-4.png", "assets/burger-bacon-5.png"],
      btn: "order", total: "11", order: "ORDER #BA095", note: null,
      items: [["DOUBLE PATTY", "Fresh prime ground beef"], ["CHEESE", "Double American cheese"], ["BACON", "Honey crispy bacon"], ["ONIONS", "Butter-grilled onions"], ["PICKLES", "Included"], ["BUN", "Potato Bun"], ["SAUCE", "Mustard 95 sauce"]],
      foot: ["Counter Order", "Wrapped in foil, napkin + wipe included"], tag: "Crispy business", rot: "-5deg", dx: "-24px", dy: "14px" },
    { key: "cheese", title: "Cheese Burger", seal: "assets/seal-cheese.svg",
      photos: ["assets/burger-cheese.png", "assets/burger-cheese-2.png", "assets/burger-cheese-3.png", "assets/burger-cheese-4.png", "assets/burger-cheese-5.png"],
      btn: "order", total: "9", order: "ORDER #BC095", note: null,
      items: [["DOUBLE PATTY", "Fresh prime ground beef"], ["CHEESE", "Double American cheese"], ["ONIONS", "Butter-grilled onions"], ["PICKLES", "Included"], ["BUN", "Potato Bun"], ["SAUCE", "95 sauce"]],
      foot: ["Counter Order", "Wrapped in foil, napkin + wipe included"], tag: "Say cheese!", rot: "6deg", dx: "22px", dy: "-8px" },
    { key: "fries", title: "Burger Fries", seal: "assets/seal-fries.svg",
      photos: ["assets/burger-fries.png", "assets/burger-fries-2.png", "assets/burger-fries-3.png", "assets/burger-fries-4.png", "assets/burger-fries-5.png"],
      btn: "order", total: "9", order: "ORDER #BF095", note: null,
      items: [["FRIES", "Classic fries*"], ["PATTY", "Fresh prime ground beef"], ["CHEESE", "American cheese"], ["ONIONS", "Butter-grilled onions"], ["SAUCE", "95 sauce"]],
      foot: ["Counter Order", "Pulp tray, fork included", "*Our fries are frozen at origin"], tag: "Fries with benefits", rot: "-4deg", dx: "-16px", dy: "22px" },
  ];

  const STARS = "*****************************************";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function receiptHTML(b, i) {
    const items = b.items.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    const foot = b.foot.map((l) => `<p>${l}</p>`).join("");
    return `
      <article class="receipt" data-i="${i}" style="--rot:${b.rot};--dx:${b.dx};--dy:${b.dy};z-index:${i + 1};">
        <img class="receipt__wordmark" src="assets/receipt-wordmark.svg" alt="Ninety-five" />
        <p class="receipt__addr">Via Sant'Agnese, 14<br />20123 Milano</p>
        <h3 class="receipt__title">${b.title}</h3>
        <div class="receipt__stars">${STARS}</div>
        <dl class="receipt__list">${items}</dl>
        <div class="receipt__stars">${STARS}</div>
        <div class="receipt__total"><span>TOTAL</span><span class="receipt__price">${b.total}.<sup>95</sup></span></div>
        <div class="receipt__stars">${STARS}</div>
        <p class="receipt__order">${b.order}</p>
        ${b.note ? `<p class="receipt__note">${b.note}</p>` : ""}
        <div class="receipt__foot">${foot}<p class="receipt__foot-bold">09/05/95 — 9:50 PM</p></div>
        <p class="receipt__tag">${b.tag}</p>
      </article>`;
  }

  function buttonHTML(b) {
    if (b.btn === "counter") {
      return `<div class="burger-btn burger-btn--counter">
        <img src="assets/counter-only.svg" alt="" aria-hidden="true" />
        <span class="burger-btn__text">Counter only<small>No delivery</small></span>
      </div>`;
    }
    return `<div class="burger-btn burger-btn--order">
      <img src="assets/order-now.svg" alt="" aria-hidden="true" />
      <span class="burger-btn__text burger-btn__text--order">Order now</span>
    </div>`;
  }

  const photosHTML = BURGERS.flatMap((b, bi) =>
    b.photos.map((src, ai) =>
      `<img class="burger-photo" data-b="${bi}" data-a="${ai}" src="${src}" alt="" draggable="false" />`
    )
  ).join("");

  root.innerHTML = `
    <div class="burger-stage">
      <div class="receipt-stack">${BURGERS.map(receiptHTML).join("")}</div>
      <div class="burger-btn-slot"></div>
      <img class="burger-seal" alt="" aria-hidden="true" />
      <div class="burger-figure">
        <div class="burger-rig">${photosHTML}</div>
        <button type="button" class="burger-info" aria-label="View ingredients">i</button>
      </div>
      <p class="burger-mobile-title" aria-live="polite"></p>
    </div>`;

  const receipts = [...root.querySelectorAll(".receipt")];
  const photos = [...root.querySelectorAll(".burger-photo")];
  const seal = root.querySelector(".burger-seal");
  const slot = root.querySelector(".burger-btn-slot");
  const infoBtn = root.querySelector(".burger-info");
  const mobileTitle = root.querySelector(".burger-mobile-title");
  let state = 0;

  seal.addEventListener("error", () => { seal.hidden = true; });

  function setState(i) {
    state = ((i % BURGERS.length) + BURGERS.length) % BURGERS.length;
    const b = BURGERS[state];
    showcase.className = "burger-showcase burger-showcase--" + b.key;
    receipts.forEach((r, j) => r.classList.toggle("is-shown", j <= state));
    if (b.seal) { seal.hidden = false; seal.src = b.seal; } else { seal.hidden = true; }
    slot.innerHTML = buttonHTML(b);
    if (mobileTitle) mobileTitle.textContent = b.title;
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function pinProgress() {
    const pinH = pin.offsetHeight;
    const viewH = showcase.offsetHeight || window.innerHeight;
    const scrollable = Math.max(1, pinH - viewH);
    const scrolled = clamp(-pin.getBoundingClientRect().top, 0, scrollable);
    return scrolled / scrollable;
  }

  function showAngle(bi, ai) {
    photos.forEach((img) => {
      const on = Number(img.dataset.b) === bi && Number(img.dataset.a) === ai;
      img.classList.toggle("is-on", on);
    });
  }

  function applyProgress(progress) {
    const n = BURGERS.length;
    if (reduceMotion) {
      const index = clamp(Math.round(progress * (n - 1)), 0, n - 1);
      if (index !== state) setState(index);
      showAngle(index, 0);
      return;
    }
    const total = n * ANGLES;
    const frame = clamp(Math.min(total - 1, Math.floor(progress * total)), 0, total - 1);
    const index = Math.floor(frame / ANGLES);
    const angle = frame % ANGLES;
    if (index !== state) setState(index);
    showAngle(index, angle);
  }

  function fitStage() {
    const stage = root.querySelector(".burger-stage");
    if (!stage || window.matchMedia("(max-width: 767px)").matches) {
      if (stage) stage.style.transform = "";
      return;
    }
    const scale = Math.min(showcase.clientWidth / 1512, showcase.clientHeight / 982);
    stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  function onScroll() {
    applyProgress(pinProgress());
  }

  setState(0);
  fitStage();
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    fitStage();
    onScroll();
  });

  function openReceipt() {
    if (!modal || !modalBody) return;
    modalBody.innerHTML = receiptHTML(BURGERS[state], state);
    const article = modalBody.querySelector(".receipt");
    if (article) {
      article.classList.add("is-shown");
      article.style.transform = "none";
    }
    modal.hidden = false;
    document.body.classList.add("has-receipt-modal");
    modal.querySelector(".receipt-modal__close")?.focus();
  }

  function closeReceipt() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("has-receipt-modal");
  }

  infoBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    openReceipt();
  });

  modal?.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-close-receipt]")) closeReceipt();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) closeReceipt();
  });
})();
