(() => {
  const CALENDLY_URL = "https://calendly.com/jchidalgo/plan";

  function textOf(card) {
    return (card.querySelector("h3")?.textContent || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function setCta(card, label) {
    const cta = card.querySelector(".tools__cta");
    if (!cta) return;
    cta.innerHTML = `<span aria-hidden="true">→</span> ${label}`;
  }

  function enableCard(card, href) {
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

  function ensureBlogCard(grid) {
    const existing = Array.from(grid.querySelectorAll(".tool-card")).find((card) =>
      textOf(card).includes("blog financiero"),
    );
    if (existing) return existing;

    const card = document.createElement("a");
    card.className = "tool-card";
    card.href = "/blog";
    card.innerHTML = `
      <span class="audience__number"></span>
      <h3>Blog financiero</h3>
      <p>Lee artículos prácticos sobre hipotecas, ahorro, protección, pensiones y planificación financiera.</p>
      <span class="tools__cta"><span aria-hidden="true">→</span> Leer blog</span>
    `;
    grid.appendChild(card);
    return card;
  }

  function applyToolOrder() {
    const grid = document.querySelector("#herramientas .tools__grid");
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll(".tool-card"));
    const savings =
      cards.find((card) => textOf(card).includes("calculadora de ahorro potencial")) ||
      cards.find((card) => textOf(card).includes("calculadora hipotecaria"));
    const test = cards.find((card) => textOf(card).includes("test de salud financiera"));
    const blog = ensureBlogCard(grid);
    const diagnostic = cards.find((card) => textOf(card).includes("diagnostico patrimonial"));
    const ordered = [savings, test, blog, diagnostic].filter(Boolean);

    if (savings) {
      const title = savings.querySelector("h3");
      const text = savings.querySelector("p");
      if (title) title.textContent = "Calculadora de ahorro potencial";
      if (text) {
        text.textContent =
          "Calcula cuánto dinero se escapa en pequeños gastos recurrentes y visualiza tu ahorro anual recuperable.";
      }
      enableCard(savings, "/herramientas/ahorro-potencial/index.html");
      setCta(savings, "Abrir calculadora");
    }
    if (test) {
      enableCard(test, "/test-salud-financiera.html");
      setCta(test, "Hacer test");
    }
    if (blog) {
      enableCard(blog, "/blog");
      setCta(blog, "Leer blog");
    }
    if (diagnostic) {
      enableCard(diagnostic, CALENDLY_URL);
      setCta(diagnostic, "Solicitar diagnóstico");
    }

    ordered.forEach((card) => grid.appendChild(card));
    Array.from(grid.querySelectorAll(".tool-card")).forEach((card, index) => {
      const number = card.querySelector(".audience__number");
      if (number) number.textContent = `Herramienta ${String(index + 1).padStart(2, "0")}`;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyToolOrder, { once: true });
  } else {
    applyToolOrder();
  }

  [250, 800, 1700, 2600, 4000].forEach((delay) => window.setTimeout(applyToolOrder, delay));
})();
