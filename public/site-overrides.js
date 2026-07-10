(() => {
  const JOSE_CARLOS_URL = "https://josecarlos.hilolegal.es";
  const VERONICA_URL = "https://veronicalopez.hilolegal.es";
  const JOSE_CARLOS_LOGO = {
    src: "/hilolegal-logo-mark.svg",
    alt: "José Carlos Hidalgo",
  };
  const HERO_TEXT =
    "Abogados, hipotecas, planificación financiera, administración de fincas, ahorro y seguros para personas que necesitan tomar decisiones importantes con seguridad. En HiloLegal unimos criterio jurídico, visión patrimonial y experiencia financiera para ayudarte a proteger lo que has construido, anticipar riesgos y tomar mejores decisiones.";
  const COMPANIES_TEXT =
    "Para empresas que licitan con el sector público y necesitan preparar decisiones jurídicas, económicas y documentales con orden, solvencia y seguridad.";
  const TOOLS_INTRO_TEXT =
    "Ponemos a tu disposición herramientas prácticas para analizar tu economía, tu hipoteca y tus riesgos principales.";
  const POSITION_IMAGE = {
    src: "/nosotros_cliente.webp",
    alt: "Equipo de HiloLegal asesorando a un cliente",
  };
  const AREA_IMAGES = {
    legal: {
      src: "/area-legal.svg",
      alt: "Ilustración del área legal de HiloLegal",
    },
    "patrimonial y financiero": {
      src: "/area-patrimonial-financiero.svg",
      alt: "Ilustración del área patrimonial y financiera de HiloLegal",
    },
    hipotecas: {
      src: "/area-hipotecas.svg",
      alt: "Ilustración del área de hipotecas de HiloLegal",
    },
    "administración de fincas": {
      src: "/area-administracion-fincas.svg",
      alt: "Ilustración del área de administración de fincas de HiloLegal",
    },
  };

  let isApplying = false;

  function normalize(text) {
    return (text || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function unwrapTextWrapper(card) {
    const textWrap = card.querySelector(":scope > .service-card__text");
    if (!textWrap) return;

    while (textWrap.firstChild) {
      card.insertBefore(textWrap.firstChild, textWrap);
    }
    textWrap.remove();
  }

  function applyJoseCarlosLogo() {
    const headerBrand = document.querySelector("header nav a[href='#']");
    if (headerBrand) {
      let headerLogo = headerBrand.querySelector(":scope > .header-logo-mark");
      if (!headerLogo) {
        headerLogo = document.createElement("img");
        headerLogo.className = "header-logo-mark";
        headerBrand.prepend(headerLogo);
      }
      headerLogo.src = JOSE_CARLOS_LOGO.src;
      headerLogo.alt = JOSE_CARLOS_LOGO.alt;
      headerLogo.decoding = "async";
    }

    const footerBrand = document.querySelector("footer .brand");
    if (footerBrand) {
      let footerLogo = footerBrand.querySelector(":scope > .footer-logo-mark");
      if (!footerLogo) {
        footerLogo = document.createElement("img");
        footerLogo.className = "footer-logo-mark";
        footerBrand.prepend(footerLogo);
      }
      footerLogo.src = JOSE_CARLOS_LOGO.src;
      footerLogo.alt = JOSE_CARLOS_LOGO.alt;
      footerLogo.loading = "lazy";
      footerLogo.decoding = "async";
    }
  }

  function applyHeroText() {
    document.querySelectorAll("main > section:first-child p").forEach((paragraph) => {
      const text = normalize(paragraph.textContent);
      if (text.includes("planificación financiera, hipotecas, seguros") || text.includes("abogados, hipotecas")) {
        paragraph.textContent = HERO_TEXT;
      }
    });

    document.querySelectorAll("main > section:first-child h1 span").forEach((span) => {
      if (span.textContent?.includes("Abogacía")) {
        span.textContent = span.textContent.replace("Abogacía", "Abogados");
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

  function applyAreaImages() {
    document.querySelectorAll(".services-editorial__card").forEach((card) => {
      unwrapTextWrapper(card);

      const titleElement = card.querySelector("h3");
      const title = normalize(titleElement?.textContent);
      const image = AREA_IMAGES[title];
      if (!image || !titleElement) return;

      card.classList.remove("services-editorial__card--split");
      card.classList.add("services-editorial__card--with-art");

      let art = card.querySelector(":scope > .service-card__art");
      if (!art) {
        art = document.createElement("div");
        art.className = "service-card__art";
        const img = document.createElement("img");
        img.loading = "lazy";
        img.decoding = "async";
        art.appendChild(img);
      }

      if (art.nextElementSibling !== titleElement) {
        card.insertBefore(art, titleElement);
      }

      const img = art.querySelector("img");
      if (img) {
        img.src = image.src;
        img.alt = image.alt;
      }
    });
  }

  function applyPositionImage() {
    const inner = document.querySelector(".position-block__inner");
    if (!inner) return;

    let media = inner.querySelector(":scope > .position-block__media");
    if (!media) {
      media = document.createElement("div");
      media.className = "position-block__media";
      const img = document.createElement("img");
      img.loading = "lazy";
      img.decoding = "async";
      media.appendChild(img);
      inner.appendChild(media);
    }

    const img = media.querySelector("img");
    if (img) {
      img.src = POSITION_IMAGE.src;
      img.alt = POSITION_IMAGE.alt;
    }
  }

  function applyToolsIntroOverride() {
    const paragraph = document.querySelector(".tools__heading p");
    if (!paragraph) return;

    const text = normalize(paragraph.textContent);
    if (text.includes("una web premium no debe limitarse a explicar servicios")) {
      paragraph.textContent = TOOLS_INTRO_TEXT;
    }
  }

  function applyHeadlineSpacing() {
    const areasAccent = document.querySelector("#areas h2 .jch-accent");
    if (areasAccent && normalize(areasAccent.textContent) === "principales") {
      areasAccent.textContent = " principales";
    }

    const audienceAccent = document.querySelector("#audiencia h2 .jch-accent");
    if (audienceAccent && normalize(audienceAccent.textContent) === "trabajamos") {
      audienceAccent.textContent = " trabajamos";
    }

    const closingAccent = document.querySelector("#cierre h2 .jch-accent");
    if (closingAccent && normalize(closingAccent.textContent).replace(/,$/, "") === "patrimonio") {
      closingAccent.textContent = " patrimonio,";
      const closingParts = Array.from(document.querySelectorAll("#cierre h2 span"));
      const commaPart = closingParts.find((part) => normalize(part.textContent).startsWith(", merece"));
      if (commaPart) commaPart.textContent = " merece ser analizada con criterio.";
    }
  }

  function applyProfessionalTextOverrides() {
    document.querySelectorAll("#equipo .pros__card").forEach((card) => {
      const name = normalize(card.querySelector("h3")?.textContent);
      const eyebrow = card.querySelector(".pros__eyebrow");
      const role = card.querySelector(".pros__role");

      if (name === "verónica lópez") {
        if (eyebrow) eyebrow.textContent = "Socia";
        if (role) role.textContent = "Abogada";
      }

      if (name === "josé carlos hidalgo") {
        if (eyebrow) eyebrow.textContent = "Socio";
        if (role) role.textContent = "gestor patrimonial e hipotecario.";
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
    applyJoseCarlosLogo();
    applyHeroText();
    applyLinkOverrides();
    applyAreaImages();
    applyPositionImage();
    applyToolsIntroOverride();
    applyHeadlineSpacing();
    applyProfessionalTextOverrides();
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
