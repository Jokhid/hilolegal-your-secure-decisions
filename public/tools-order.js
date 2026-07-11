(() => {
  function textOf(card) {
    return (card.querySelector("h3")?.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function setCta(card, label) {
    const cta = card.querySelector(".tools__cta");
    if (!cta) return;
    cta.innerHTML = `<span aria-hidden="true">→</span> ${label}`;
  }

  function applyToolOrder() {
    const grid = document.querySelector("#herramientas .tools__grid");
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll(".tool-card"));
    const test = cards.find((card) => textOf(card).includes("test de salud financiera"));
    const mortgage = cards.find((card) => textOf(card).includes("calculadora hipotecaria"));
    const diagnostic = cards.find((card) => textOf(card).includes("diagnóstico patrimonial"));
    const ordered = [test, mortgage, diagnostic].filter(Boolean);

    ordered.forEach((card) => grid.appendChild(card));

    ordered.forEach((card, index) => {
      const number = card.querySelector(".audience__number");
      if (number) number.textContent = `Herramienta ${String(index + 1).padStart(2, "0")}`;

      if (card === test) {
        card.removeAttribute("aria-disabled");
        card.removeAttribute("tabindex");
        card.href = "/test-salud-financiera.html";
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        setCta(card, "Hacer test");
      } else {
        card.setAttribute("aria-disabled", "true");
        card.setAttribute("tabindex", "-1");
        card.href = "#herramientas";
        card.removeAttribute("target");
        card.removeAttribute("rel");
        setCta(card, "Próximamente");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyToolOrder, { once: true });
  } else {
    applyToolOrder();
  }

  [250, 800, 1700, 2600, 4000].forEach((delay) => window.setTimeout(applyToolOrder, delay));
})();
