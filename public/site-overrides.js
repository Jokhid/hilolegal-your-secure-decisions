(() => {
  const JOSE_CARLOS_URL = "https://josecarlos.hilolegal.es";
  const VERONICA_URL = "https://veronicalopez.hilolegal.es";
  const HERO_TEXT =
    "Abogados, hipotecas, planificación financiera, administración de fincas, ahorro y seguros para personas que necesitan tomar decisiones importantes con seguridad. En HiloLegal unimos criterio jurídico, visión patrimonial y experiencia financiera para ayudarte a proteger lo que has construido, anticipar riesgos y tomar mejores decisiones.";
  const COMPANIES_TEXT =
    "Para empresas que licitan con el sector público y necesitan preparar decisiones jurídicas, económicas y documentales con orden, solvencia y seguridad.";

  let isApplying = false;

  function normalize(text) {
    return (text || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function applyHeroText() {
    document.querySelectorAll("main > section:first-child p").forEach((paragraph) => {
      const text = normalize(paragraph.textContent);
      if (text.includes("planificación financiera, hipotecas, seguros") || text.includes("abogados, hipotecas")) {
        paragraph.textContent = HERO_TEXT;
      }
    });
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

  function getAudienceCardByTitle(cards, title) {
    return cards.find((card) => normalize(card.querySelector("h3")?.textContent) === normalize(title));
  }

  function applyAudienceOverrides() {
    const grid = document.querySelector(".audience__grid");
    if (!grid) return;

    let cards = Array.from(grid.querySelectorAll(".audience__card"));
    const legacyCompaniesCard = getAudienceCardByTitle(cards, "Comunidades de propietarios");

    if (legacyCompaniesCard) {
      const title = legacyCompaniesCard.querySelector("h3");
      if (title) title.textContent = "Empresas";
    }

    cards = Array.from(grid.querySelectorAll(".audience__card"));
    const companiesCard = getAudienceCardByTitle(cards, "Empresas");
    if (companiesCard) {
      const text = companiesCard.querySelector("p");
      if (text) text.textContent = COMPANIES_TEXT;
    }

    const orderedCards = ["Familias", "Autónomos", "Empresas", "Propietarios"]
      .map((title) => getAudienceCardByTitle(cards, title))
      .filter(Boolean);

    orderedCards.forEach((card) => grid.appendChild(card));

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
    if (isApplying) return;
    isApplying = true;
    applyHeroText();
    applyLinkOverrides();
    applyAudienceOverrides();
    applyToolsOverrides();
    window.setTimeout(() => {
      isApplying = false;
    }, 0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyOverrides, { once: true });
  } else {
    applyOverrides();
  }

  window.addEventListener("load", applyOverrides, { once: true });
  window.setTimeout(applyOverrides, 250);
  window.setTimeout(applyOverrides, 750);
  window.setTimeout(applyOverrides, 1500);

  const observer = new MutationObserver(applyOverrides);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
