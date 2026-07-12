(() => {
  const JOSE_CARLOS_URL = "https://josecarlos.hilolegal.es";
  const VERONICA_URL = "https://veronicalopez.hilolegal.es";
  const CALENDLY_URL = "https://calendly.com/jchidalgo/plan";
  const LOGO = { src: "/hilolegal-logo-mark.svg", alt: "HiloLegal" };
  const BRAND_TEXT = "HILOLEGAL";
  const HERO_TEXT = "Abogados, hipotecas, planificación financiera, administración de fincas, ahorro y seguros para personas que necesitan tomar decisiones importantes con seguridad. En HiloLegal unimos criterio jurídico, visión patrimonial y experiencia financiera para ayudarte a proteger lo que has construido, anticipar riesgos y tomar mejores decisiones.";
  const COMPANIES_TEXT = "Para empresas que licitan con el sector público y necesitan preparar decisiones jurídicas, económicas y documentales con orden, solvencia y seguridad.";
  const TOOLS_INTRO_TEXT = "Ponemos a tu disposición herramientas prácticas para analizar tu economía, tu hipoteca y tus riesgos principales.";
  const TRUST_IMAGE = { src: "/hilolegal%20altea.webp", alt: "HiloLegal Altea - guía legal, protección patrimonial y crecimiento financiero" };
  const AREA_IMAGES = {
    legal: ["/area-legal.svg", "Ilustración del área legal de HiloLegal"],
    "patrimonial y financiero": ["/area-patrimonial-financiero.svg", "Ilustración del área patrimonial y financiera de HiloLegal"],
    hipotecas: ["/area-hipotecas.svg", "Ilustración del área de hipotecas de HiloLegal"],
    "administración de fincas": ["/area-administracion-fincas.svg", "Ilustración del área de administración de fincas de HiloLegal"],
  };

  let applying = false;
  const norm = (text) => (text || "").replace(/\s+/g, " ").trim().toLowerCase();

  function setBrandText(container) {
    if (!container) return;
    const span = container.querySelector("span");
    if (span) {
      span.textContent = BRAND_TEXT;
      return;
    }
    const textNode = Array.from(container.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    if (textNode) textNode.textContent = BRAND_TEXT;
    else container.appendChild(document.createTextNode(BRAND_TEXT));
  }

  function addLogos() {
    const headerBrand = document.querySelector("header nav a[href='#']");
    if (headerBrand && !headerBrand.querySelector(".header-logo-mark")) {
      const logo = document.createElement("img");
      logo.className = "header-logo-mark";
      logo.src = LOGO.src;
      logo.alt = LOGO.alt;
      logo.decoding = "async";
      headerBrand.prepend(logo);
    }
    setBrandText(headerBrand);

    const footerBrand = document.querySelector("footer .brand");
    if (footerBrand && !footerBrand.querySelector(".footer-logo-mark")) {
      const logo = document.createElement("img");
      logo.className = "footer-logo-mark";
      logo.src = LOGO.src;
      logo.alt = LOGO.alt;
      logo.loading = "lazy";
      logo.decoding = "async";
      footerBrand.prepend(logo);
    }
    setBrandText(footerBrand);
  }

  function updateHero() {
    document.querySelectorAll("main > section:first-child p").forEach((p) => {
      const text = norm(p.textContent);
      if (text.includes("planificación financiera, hipotecas") || text.includes("abogados, hipotecas")) p.textContent = HERO_TEXT;
    });
    document.querySelectorAll("main > section:first-child h1 span").forEach((span) => {
      if (span.textContent?.includes("Abogacía")) span.textContent = span.textContent.replace("Abogacía", "Abogados");
    });
  }

  function updateLinks() {
    document.querySelectorAll("a").forEach((link) => {
      const text = norm(link.textContent);
      if (text.includes("conocer a verónica") || text.includes("ver servicios legales")) link.href = VERONICA_URL;
      if (text.includes("conocer a josé carlos") || text.includes("ver asesoramiento patrimonial") || text.includes("ver hipotecas") || text.includes("ver administración de fincas")) link.href = JOSE_CARLOS_URL;
    });
  }

  function updateTrustImage() {
    const inner = document.querySelector(".trust-block__inner");
    if (!inner) return;
    let media = inner.querySelector(":scope > .trust-block__media");
    if (!media) {
      media = document.createElement("div");
      media.className = "trust-block__media";
      media.innerHTML = '<img loading="lazy" decoding="async" />';
      inner.appendChild(media);
    }
    const img = media.querySelector("img");
    img.src = TRUST_IMAGE.src;
    img.alt = TRUST_IMAGE.alt;
  }

  function updateAreas() {
    document.querySelectorAll(".services-editorial__card").forEach((card) => {
      const title = card.querySelector("h3");
      const data = AREA_IMAGES[norm(title?.textContent)];
      if (!title || !data) return;
      card.classList.add("services-editorial__card--with-art");
      card.classList.remove("services-editorial__card--split");
      const wrapper = card.querySelector(":scope > .service-card__text");
      if (wrapper) {
        while (wrapper.firstChild) card.insertBefore(wrapper.firstChild, wrapper);
        wrapper.remove();
      }
      let art = card.querySelector(":scope > .service-card__art");
      if (!art) {
        art = document.createElement("div");
        art.className = "service-card__art";
        art.innerHTML = '<img loading="lazy" decoding="async" />';
      }
      if (art.nextElementSibling !== title) card.insertBefore(art, title);
      const img = art.querySelector("img");
      img.src = data[0];
      img.alt = data[1];
    });
  }

  function updatePositionImage() {
    const inner = document.querySelector(".position-block__inner");
    if (!inner) return;
    let media = inner.querySelector(":scope > .position-block__media");
    if (!media) {
      media = document.createElement("div");
      media.className = "position-block__media";
      media.innerHTML = '<img loading="lazy" decoding="async" />';
      inner.appendChild(media);
    }
    const img = media.querySelector("img");
    img.src = "/nosotros_cliente.webp";
    img.alt = "Equipo de HiloLegal asesorando a un cliente";
  }

  function updateText() {
    const toolsIntro = document.querySelector(".tools__heading p");
    if (toolsIntro && norm(toolsIntro.textContent).includes("una web premium")) toolsIntro.textContent = TOOLS_INTRO_TEXT;

    const areasAccent = document.querySelector("#areas h2 .jch-accent");
    if (areasAccent && norm(areasAccent.textContent) === "principales") areasAccent.textContent = " principales";

    const audienceAccent = document.querySelector("#audiencia h2 .jch-accent");
    if (audienceAccent && norm(audienceAccent.textContent) === "trabajamos") audienceAccent.textContent = " trabajamos";

    const closingAccent = document.querySelector("#cierre h2 .jch-accent");
    if (closingAccent && norm(closingAccent.textContent).replace(/,$/, "") === "patrimonio") {
      closingAccent.textContent = " patrimonio,";
      const commaPart = Array.from(document.querySelectorAll("#cierre h2 span")).find((part) => norm(part.textContent).startsWith(", merece"));
      if (commaPart) commaPart.textContent = " merece ser analizada con criterio.";
    }

    document.querySelectorAll("#equipo .pros__card").forEach((card) => {
      const name = norm(card.querySelector("h3")?.textContent);
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

  function updateAudience() {
    const grid = document.querySelector(".audience__grid");
    if (!grid) return;
    const byTitle = (title) => Array.from(grid.querySelectorAll(".audience__card")).find((card) => norm(card.querySelector("h3")?.textContent) === norm(title));
    const legacy = byTitle("Comunidades de propietarios");
    if (legacy) legacy.querySelector("h3").textContent = "Empresas";
    const companies = byTitle("Empresas");
    if (companies) companies.querySelector("p").textContent = COMPANIES_TEXT;
    ["Familias", "Autónomos", "Empresas", "Propietarios"].map(byTitle).filter(Boolean).forEach((card) => grid.appendChild(card));
    Array.from(grid.querySelectorAll(".audience__card")).forEach((card, index) => {
      const number = card.querySelector(".audience__number");
      if (number) number.textContent = String(index + 1).padStart(2, "0");
    });
  }

  function enableTool(card, href) {
    card.removeAttribute("aria-disabled");
    card.removeAttribute("tabindex");
    card.href = href;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
  }

  function updateTools() {
    const grid = document.querySelector("#herramientas .tools__grid");
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll(".tool-card"));
    const find = (title) => cards.find((card) => norm(card.querySelector("h3")?.textContent).includes(title));
    const test = find("test de salud financiera");
    const mortgage = find("calculadora hipotecaria");
    const diagnostic = find("diagnóstico patrimonial");
    [test, mortgage, diagnostic].filter(Boolean).forEach((card) => grid.appendChild(card));
    [test, mortgage, diagnostic].filter(Boolean).forEach((card, index) => {
      const number = card.querySelector(".audience__number");
      if (number) number.textContent = `Herramienta ${String(index + 1).padStart(2, "0")}`;
      const cta = card.querySelector(".tools__cta");
      if (card === test) {
        enableTool(card, "/test-salud-financiera.html");
        if (cta) cta.textContent = "→ Hacer test";
      } else if (card === diagnostic) {
        enableTool(card, CALENDLY_URL);
        if (cta) cta.textContent = "→ Solicitar diagnóstico";
      } else {
        card.setAttribute("aria-disabled", "true");
        card.setAttribute("tabindex", "-1");
        card.href = "#herramientas";
        card.removeAttribute("target");
        card.removeAttribute("rel");
        if (cta) cta.textContent = "Próximamente";
      }
    });
  }

  function apply() {
    if (applying) return;
    applying = true;
    addLogos();
    updateHero();
    updateLinks();
    updateTrustImage();
    updateAreas();
    updatePositionImage();
    updateText();
    updateAudience();
    updateTools();
    window.setTimeout(() => { applying = false; }, 0);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply, { once: true });
  else apply();
  window.addEventListener("load", apply, { once: true });
  [250, 750, 1500, 2600].forEach((delay) => window.setTimeout(apply, delay));
  new MutationObserver(apply).observe(document.documentElement, { childList: true, subtree: true });
})();
