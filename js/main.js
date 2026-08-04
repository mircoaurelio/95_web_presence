/* ============================================================
   NINETYFIVE — script del sito
   ============================================================ */

/* ---------- Hero: rotazione delle parole ---------- */
/* Le parole ciclano come nel Figma: House of ___ */
(function heroRotator() {
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

  let i = 0;
  const HOLD = 2000;   // quanto resta ferma ogni parola (ms)
  const FADE = 350;    // durata della dissolvenza (ms)

  // Rispetta chi ha attivato "riduci animazioni" nel sistema
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  setInterval(() => {
    el.classList.add("is-out");           // esce (dissolve verso il basso)
    setTimeout(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.classList.remove("is-out");      // entra la nuova parola
    }, FADE);
  }, HOLD);
})();

/* ---------- Combo: "Make it Burger Fries" → banner scuro + prezzi +5 ---------- */
(function comboUpgrade() {
  const combo = document.querySelector(".combo");
  const makeBar = document.querySelector(".combo__bar--make");
  if (!combo || !makeBar) return;

  // Su touch non esiste hover: la barra diventa un interruttore da toccare.
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

/* ---------- Carosello panini: click per avanzare, scontrini che si impilano ---------- */
(function burgerCarousel() {
  const showcase = document.querySelector(".burger-showcase");
  const root = document.getElementById("burgerCarousel");
  if (!showcase || !root) return;

  const BURGERS = [
    { key: "butter", title: "Butter Burger", seal: "assets/seal-butter-burger.svg",
      btn: "counter", total: "10", order: "ORDER #BB095", note: "NO DELIVERY - COUNTER ONLY",
      items: [["DOUBLE PATTY", "Fresh prime ground beef"], ["CHEESE", "Double white cheddar"], ["ONIONS", "Butter-grilled onions"], ["PICKLES", "Included"], ["BUN", "Potato Bun"], ["BUTTER", "Soft butter"]],
      foot: ["Counter Order", "Plate + napkin + wipe"], tag: "Butter is better!", rot: "2deg", dx: "0px", dy: "0px" },
    { key: "bacon", title: "Bacon Burger", seal: "assets/seal-bacon.svg",
      btn: "order", total: "11", order: "ORDER #BA095", note: null,
      items: [["DOUBLE PATTY", "Fresh prime ground beef"], ["CHEESE", "Double American cheese"], ["BACON", "Honey crispy bacon"], ["ONIONS", "Butter-grilled onions"], ["PICKLES", "Included"], ["BUN", "Potato Bun"], ["SAUCE", "Mustard 95 sauce"]],
      foot: ["Counter Order", "Wrapped in foil, napkin + wipe included"], tag: "Crispy business", rot: "-5deg", dx: "-24px", dy: "14px" },
    { key: "cheese", title: "Cheese Burger", seal: "assets/seal-cheese.svg",
      btn: "order", total: "9", order: "ORDER #BC095", note: null,
      items: [["DOUBLE PATTY", "Fresh prime ground beef"], ["CHEESE", "Double American cheese"], ["ONIONS", "Butter-grilled onions"], ["PICKLES", "Included"], ["BUN", "Potato Bun"], ["SAUCE", "95 sauce"]],
      foot: ["Counter Order", "Wrapped in foil, napkin + wipe included"], tag: "Say cheese!", rot: "6deg", dx: "22px", dy: "-8px" },
    { key: "fries", title: "Burger Fries", seal: "assets/seal-fries.svg",
      btn: "order", total: "9", order: "ORDER #BF095", note: null,
      items: [["FRIES", "Classic fries*"], ["PATTY", "Fresh prime ground beef"], ["CHEESE", "American cheese"], ["ONIONS", "Butter-grilled onions"], ["SAUCE", "95 sauce"]],
      foot: ["Counter Order", "Pulp tray, fork included", "*Our fries are frozen at origin"], tag: "Fries with benefits", rot: "-4deg", dx: "-16px", dy: "22px" },
  ];

  const STARS = "*****************************************";

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
        <div class="receipt__total"><span>TOTAL</span><span class="receipt__price">${b.total}<sup>95</sup></span></div>
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

  root.innerHTML = `
    <div class="burger-stage">
      <div class="receipt-stack">${BURGERS.map(receiptHTML).join("")}</div>
      <div class="burger-btn-slot"></div>
      <img class="burger-seal" alt="" aria-hidden="true" />
      <img class="burger-photo" src="assets/burger-photo.png" alt="Ninetyfive burger" />
    </div>`;

  const receipts = [...root.querySelectorAll(".receipt")];
  const seal = root.querySelector(".burger-seal");
  const slot = root.querySelector(".burger-btn-slot");
  let state = 0;

  // se un bollo non è ancora disponibile, si nasconde invece di apparire "rotto"
  seal.addEventListener("error", () => { seal.hidden = true; });

  function setState(i) {
    state = ((i % BURGERS.length) + BURGERS.length) % BURGERS.length;
    const b = BURGERS[state];
    showcase.className = "burger-showcase burger-showcase--" + b.key;
    receipts.forEach((r, j) => r.classList.toggle("is-shown", j <= state));
    if (b.seal) { seal.hidden = false; seal.src = b.seal; } else { seal.hidden = true; }
    slot.innerHTML = buttonHTML(b);
  }

  setState(0);
  showcase.style.cursor = "pointer";
  showcase.addEventListener("click", () => setState(state + 1));
})();
