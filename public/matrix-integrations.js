(() => {
  const CALENDLY_URL = "https://calendly.com/jchidalgo/plan";
  const TOOL_LINKS = {
    savings: "/herramientas/ahorro-potencial/index.html",
    test: "/test-salud-financiera.html",
    blog: "/blog",
    diagnostic: CALENDLY_URL,
  };

  const normalize = (text) =>
    (text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  function setInternalLink(link, href) {
    link.href = href;
    link.removeAttribute("target");
    link.removeAttribute("rel");
  }

  function setToolLink(card, href) {
    card.removeAttribute("aria-disabled");
    card.removeAttribute("tabindex");
    card.href = href;
    if (/^https?:\/\//i.test(href)) {
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    } else {
      card.removeAttribute("target");
      card.removeAttribute("rel");
    }
  }

  function setCta(card, label) {
    const cta = card.querySelector(".tools__cta");
    if (!cta) return;
    cta.innerHTML = `<span aria-hidden="true">→</span> ${label}`;
  }

  function updateProfessionalAndAreaLinks() {
    document.querySelectorAll("a").forEach((link) => {
      const text = normalize(link.textContent);
      if (text.includes("conocer a veronica") || text.includes("ver servicios legales")) {
        setInternalLink(link, text.includes("servicios") ? "/veronica/#services" : "/veronica/");
      }
      if (
        text.includes("conocer a jose carlos") ||
        text.includes("ver asesoramiento patrimonial") ||
        text.includes("ver hipotecas") ||
        text.includes("ver administracion de fincas")
      ) {
        setInternalLink(link, "/josecarlos/");
      }
    });
  }

  function ensureCard(grid, title, text, ctaLabel, href) {
    const cards = Array.from(grid.querySelectorAll(".tool-card"));
    const existing = cards.find((card) => normalize(card.querySelector("h3")?.textContent).includes(normalize(title)));
    const card = existing || document.createElement("a");

    if (!existing) {
      card.className = "tool-card";
      card.innerHTML = `
        <span class="audience__number"></span>
        <h3></h3>
        <p></p>
        <span class="tools__cta"><span aria-hidden="true">→</span></span>
      `;
      grid.appendChild(card);
    }

    card.querySelector("h3").textContent = title;
    card.querySelector("p").textContent = text;
    setToolLink(card, href);
    setCta(card, ctaLabel);
    return card;
  }

  function updateToolsMatrix() {
    const grid = document.querySelector("#herramientas .tools__grid");
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll(".tool-card"));
    const byTitle = (needle) =>
      cards.find((card) => normalize(card.querySelector("h3")?.textContent).includes(normalize(needle)));

    const savings =
      byTitle("calculadora de ahorro potencial") ||
      byTitle("calculadora hipotecaria") ||
      ensureCard(
        grid,
        "Calculadora de ahorro potencial",
        "Calcula cuánto dinero se escapa en pequeños gastos recurrentes y visualiza tu ahorro anual recuperable.",
        "Abrir calculadora",
        TOOL_LINKS.savings,
      );

    savings.querySelector("h3").textContent = "Calculadora de ahorro potencial";
    savings.querySelector("p").textContent =
      "Calcula cuánto dinero se escapa en pequeños gastos recurrentes y visualiza tu ahorro anual recuperable.";
    setToolLink(savings, TOOL_LINKS.savings);
    setCta(savings, "Abrir calculadora");

    const test = byTitle("test de salud financiera");
    if (test) {
      setToolLink(test, TOOL_LINKS.test);
      setCta(test, "Hacer test");
    }

    const blog = ensureCard(
      grid,
      "Blog financiero",
      "Lee artículos prácticos sobre hipotecas, ahorro, protección, pensiones y planificación financiera.",
      "Leer blog",
      TOOL_LINKS.blog,
    );

    const diagnostic = byTitle("diagnostico patrimonial");
    if (diagnostic) {
      setToolLink(diagnostic, TOOL_LINKS.diagnostic);
      setCta(diagnostic, "Solicitar diagnóstico");
    }

    [savings, test, blog, diagnostic].filter(Boolean).forEach((card) => grid.appendChild(card));
    Array.from(grid.querySelectorAll(".tool-card")).forEach((card, index) => {
      const number = card.querySelector(".audience__number");
      if (number) number.textContent = `Herramienta ${String(index + 1).padStart(2, "0")}`;
    });
  }

  function applyMatrixIntegrations() {
    updateProfessionalAndAreaLinks();
    updateToolsMatrix();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyMatrixIntegrations, { once: true });
  } else {
    applyMatrixIntegrations();
  }

  window.addEventListener("load", applyMatrixIntegrations, { once: true });
  [250, 800, 1700, 3000, 5200, 7200].forEach((delay) =>
    window.setTimeout(applyMatrixIntegrations, delay),
  );
})();
