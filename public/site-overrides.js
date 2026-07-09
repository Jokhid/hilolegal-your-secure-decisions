(() => {
  const JOSE_CARLOS_URL = "https://josecarlos.hilolegal.es";
  const VERONICA_URL = "https://veronicalopez.hilolegal.es";

  function normalize(text) {
    return (text || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function applyLinkOverrides() {
    document.querySelectorAll("a").forEach((link) => {
      const text = normalize(link.textContent);

      if (text.includes("conocer a verónica") || text.includes("ver servicios legales")) {
        link.href = VERONICA_URL;
      }

      if (
        text.includes("conocer a josé carlos") ||
        text.includes("ver asesoramiento patrimonial") ||
        text.includes("ver hipotecas") ||
        text.includes("ver administración de fincas")
      ) {
        link.href = JOSE_CARLOS_URL;
      }
    });
  }

  function applyAudienceOverrides() {
    const grid = document.querySelector(".audience__grid");
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll(".audience__card"));
    const companiesCard = cards.find((card) => normalize(card.querySelector("h3")?.textContent) === "comunidades de propietarios");
    const ownersCard = cards.find((card) => normalize(card.querySelector("h3")?.textContent) === "propietarios");

    if (companiesCard) {
      const title = companiesCard.querySelector("h3");
      const text = companiesCard.querySelector("p");

      if (title) title.textContent = "Empresas";
      if (text) {
        text.textContent =
          "Para empresas que licitan con el sector público y necesitan preparar decisiones jurídicas, económicas y documentales con orden, solvencia y seguridad.";
      }

      if (ownersCard) grid.insertBefore(companiesCard, ownersCard);
    }

    Array.from(grid.querySelectorAll(".audience__card")).forEach((card, index) => {
      const number = card.querySelector(".audience__number");
      if (number) number.textContent = String(index + 1).padStart(2, "0");
    });
  }

  function applyToolsOverrides() {
    document.querySelectorAll(".tool-card").forEach((card) => {
      card.setAttribute("aria-disabled", "true");
      card.setAttribute("tabindex", "-1");
      card.href = "#herramientas";

      const cta = card.querySelector(".tools__cta");
      if (cta) cta.textContent = "Próximamente";
    });
  }

  function applyOverrides() {
    applyLinkOverrides();
    applyAudienceOverrides();
    applyToolsOverrides();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyOverrides, { once: true });
  } else {
    applyOverrides();
  }

  window.addEventListener("load", applyOverrides, { once: true });
  window.setTimeout(applyOverrides, 500);
  window.setTimeout(applyOverrides, 1500);
})();
