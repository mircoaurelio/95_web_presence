/* ============================================================
   NINETYFIVE — script del sito
   ============================================================ */

const ASSETS = document.body?.dataset.assets || "assets/";

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

/* ---------- Signs / stickers: tutti draggabili da desktop ---------- */
(function signsPlay() {
  const canDrag = () => window.innerWidth >= 768;
  let dragging = null;
  let ox = 0;
  let oy = 0;

  function parentScale(parent) {
    const rect = parent.getBoundingClientRect();
    const w = parent.offsetWidth || rect.width;
    const h = parent.offsetHeight || rect.height;
    return {
      sx: w ? rect.width / w : 1,
      sy: h ? rect.height / h : 1,
      rect,
    };
  }

  function startDrag(el, clientX, clientY, pointerId) {
    const r = el.getBoundingClientRect();
    ox = clientX - r.left;
    oy = clientY - r.top;
    dragging = el;
    el.classList.add("is-dragging");
    if (pointerId != null) {
      try { el.setPointerCapture(pointerId); } catch (_) {}
    }
  }

  function moveDrag(clientX, clientY) {
    if (!dragging) return;
    const parent = dragging.offsetParent || document.body;
    const { sx, sy, rect } = parentScale(parent);
    dragging.style.left = `${(clientX - ox - rect.left) / (sx || 1)}px`;
    dragging.style.top = `${(clientY - oy - rect.top) / (sy || 1)}px`;
    dragging.style.right = "auto";
    dragging.style.bottom = "auto";
    dragging.style.position = "absolute";
  }

  function release() {
    if (!dragging) return;
    dragging.classList.remove("is-dragging");
    dragging = null;
  }

  document.addEventListener("pointerdown", (e) => {
    const el = e.target.closest(".sign");
    if (!el || !canDrag() || e.button !== 0) return;
    startDrag(el, e.clientX, e.clientY, e.pointerId);
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    moveDrag(e.clientX, e.clientY);
  });

  document.addEventListener("pointerup", release);
  document.addEventListener("pointercancel", release);

  document.addEventListener("mousedown", (e) => {
    if (e.pointerType) return;
    const el = e.target.closest(".sign");
    if (!el || !canDrag() || e.button !== 0) return;
    startDrag(el, e.clientX, e.clientY, null);
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    moveDrag(e.clientX, e.clientY);
  });

  document.addEventListener("mouseup", release);
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
    { key: "butter", title: "Butter Burger", seal: ASSETS + "seal-butter-burger.svg",
      photos: [ASSETS + "burger-butter.png", ASSETS + "burger-butter-2.png", ASSETS + "burger-butter-3.png", ASSETS + "burger-butter-4.png", ASSETS + "burger-butter-5.png"],
      btn: "counter", total: "10", order: "ORDER #BB095", note: "NO DELIVERY - COUNTER ONLY",
      items: [["DOUBLE PATTY", "Fresh prime ground beef"], ["CHEESE", "Double white cheddar"], ["ONIONS", "Butter-grilled onions"], ["PICKLES", "Included"], ["BUN", "Potato Bun"], ["BUTTER", "Soft butter"]],
      foot: ["Counter Order", "Plate + napkin + wipe"], tag: "Butter is better!", rot: "2deg", dx: "0px", dy: "0px" },
    { key: "bacon", title: "Bacon Burger", seal: ASSETS + "seal-bacon.svg",
      photos: [ASSETS + "burger-bacon.png", ASSETS + "burger-bacon-2.png", ASSETS + "burger-bacon-3.png", ASSETS + "burger-bacon-4.png", ASSETS + "burger-bacon-5.png"],
      btn: "order", total: "11", order: "ORDER #BA095", note: null,
      items: [["DOUBLE PATTY", "Fresh prime ground beef"], ["CHEESE", "Double American cheese"], ["BACON", "Honey crispy bacon"], ["ONIONS", "Butter-grilled onions"], ["PICKLES", "Included"], ["BUN", "Potato Bun"], ["SAUCE", "Mustard 95 sauce"]],
      foot: ["Counter Order", "Wrapped in foil, napkin + wipe included"], tag: "Crispy business", rot: "-5deg", dx: "-24px", dy: "14px" },
    { key: "cheese", title: "Cheese Burger", seal: ASSETS + "seal-cheese.svg",
      photos: [ASSETS + "burger-cheese.png", ASSETS + "burger-cheese-2.png", ASSETS + "burger-cheese-3.png", ASSETS + "burger-cheese-4.png", ASSETS + "burger-cheese-5.png"],
      btn: "order", total: "9", order: "ORDER #BC095", note: null,
      items: [["DOUBLE PATTY", "Fresh prime ground beef"], ["CHEESE", "Double American cheese"], ["ONIONS", "Butter-grilled onions"], ["PICKLES", "Included"], ["BUN", "Potato Bun"], ["SAUCE", "95 sauce"]],
      foot: ["Counter Order", "Wrapped in foil, napkin + wipe included"], tag: "Say cheese!", rot: "6deg", dx: "22px", dy: "-8px" },
    { key: "fries", title: "Burger Fries", seal: ASSETS + "seal-fries.svg",
      photos: [ASSETS + "burger-fries.png", ASSETS + "burger-fries-2.png", ASSETS + "burger-fries-3.png", ASSETS + "burger-fries-4.png", ASSETS + "burger-fries-5.png"],
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
        <img class="receipt__wordmark" src="${ASSETS}receipt-wordmark.svg" alt="Ninety-five" />
        <p class="receipt__addr">Via Sant'Agnese, 14<br />20123 Milano</p>
        <h3 class="receipt__title">${b.title}</h3>
        <div class="receipt__stars">${STARS}</div>
        <p class="receipt__more">Click for More</p>
        <div class="receipt__details">
          <div class="receipt__details-inner">
            <dl class="receipt__list">${items}</dl>
            <div class="receipt__stars">${STARS}</div>
            <div class="receipt__total"><span>TOTAL</span><span class="receipt__price">${b.total}<span class="cents">.95</span></span></div>
            <div class="receipt__stars">${STARS}</div>
            <p class="receipt__order">${b.order}</p>
            ${b.note ? `<p class="receipt__note">${b.note}</p>` : ""}
            <div class="receipt__foot">${foot}<p class="receipt__foot-bold">09/05/95 — 9:50 PM</p></div>
            <p class="receipt__tag">${b.tag}</p>
          </div>
        </div>
      </article>`;
  }

  function buttonHTML(b) {
    if (b.btn === "counter") {
      return `<div class="burger-btn burger-btn--counter">
        <img src="${ASSETS}counter-only.svg" alt="" aria-hidden="true" />
        <span class="burger-btn__text">Counter only<small>No delivery</small></span>
      </div>`;
    }
    return `<div class="burger-btn burger-btn--order">
      <img src="${ASSETS}order-now.svg" alt="" aria-hidden="true" />
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
      <img class="burger-seal sign" alt="" aria-hidden="true" draggable="false" />
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
  let lastFrame = -1;
  let scrollFrame = 0;

  seal.addEventListener("error", () => { seal.hidden = true; });

  function isMobile() {
    return window.matchMedia("(max-width: 767px)").matches;
  }

  function setState(i) {
    state = ((i % BURGERS.length) + BURGERS.length) % BURGERS.length;
    const b = BURGERS[state];
    const mobile = isMobile();
    showcase.className = "burger-showcase burger-showcase--" + b.key;
    receipts.forEach((r, j) => {
      const on = mobile ? j === state : j <= state;
      r.classList.toggle("is-shown", on);
      if (!on || !mobile) r.classList.remove("is-open");
      if (mobile) r.setAttribute("tabindex", "0");
      else r.removeAttribute("tabindex");
      r.setAttribute("aria-expanded", r.classList.contains("is-open") ? "true" : "false");
    });
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
    const total = n * ANGLES;
    const frame = reduceMotion
      ? clamp(Math.round(progress * (n - 1)), 0, n - 1) * ANGLES
      : clamp(Math.floor(progress * total), 0, total - 1);
    if (frame === lastFrame) return;
    lastFrame = frame;
    const index = Math.floor(frame / ANGLES);
    const angle = frame % ANGLES;
    if (index !== state) setState(index);
    showAngle(index, angle);
  }

  function fitStage() {
    const stage = root.querySelector(".burger-stage");
    if (!stage || isMobile()) {
      if (stage) stage.style.transform = "";
      return;
    }
    const nav = document.querySelector(".nav");
    const topSafe = Math.max(0, (nav ? nav.getBoundingClientRect().bottom : 0) + 10);
    const availH = Math.max(240, showcase.clientHeight - topSafe);
    const scale = Math.min(showcase.clientWidth / 1512, availH / 982);
    stage.style.transform = `translate(-50%, calc(-50% + ${topSafe / 2}px)) scale(${scale})`;
  }

  function onScroll() {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      applyProgress(pinProgress());
    });
  }

  setState(0);
  fitStage();
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    fitStage();
    setState(state);
    onScroll();
  });

  receipts.forEach((r) => {
    r.addEventListener("click", () => {
      if (!isMobile() || !r.classList.contains("is-shown")) return;
      r.classList.toggle("is-open");
      r.setAttribute("aria-expanded", r.classList.contains("is-open") ? "true" : "false");
    });
    r.addEventListener("keydown", (e) => {
      if (!isMobile() || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault();
      r.click();
    });
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
