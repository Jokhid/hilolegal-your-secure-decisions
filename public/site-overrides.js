(() => {
  const JOSE_CARLOS_URL = "/josecarlos/";
  const VERONICA_URL = "/veronica/";
  const VERONICA_SERVICES_URL = "/veronica/#services";
  const CALENDLY_URL = "https://calendly.com/jchidalgo/plan";
  const LOGO = { src: "/hilolegal-logo-mark.svg", alt: "HiloLegal" };
  const BRAND_TEXT = "HILOLEGAL";
  const HERO_TEXT = "Abogados, hipotecas, planificación financiera, administración de fincas, ahorro y seguros para personas que necesitan tomar decisiones importantes con seguridad. En HiloLegal unimos criterio jurídico, visión patrimonial y experiencia financiera para ayudarte a proteger lo que has construido, anticipar riesgos y tomar mejores decisiones.";
  const COMPANIES_TEXT = "Para empresas que licitan con el sector público y necesitan preparar decisiones jurídicas, económicas y documentales con orden, solvencia y seguridad.";
  const TOOLS_INTRO_TEXT = "Ponemos a tu disposición herramientas prácticas para analizar tu economía, tu hipoteca y tus riesgos principales.";
  const JOSE_CARLOS_BIO = "Más de 25 años de experiencia en asesoría y administración. Administrador de fincas y gestor de Nationale Nederlanden, ING y Abanca. Especialista en planificación financiera, hipotecas, seguros y ahorro.";
  const AREA_IMAGES = {
    legal: ["/area-legal.svg", "Ilustración del área legal de HiloLegal"],
    "patrimonial y financiero": ["/area-patrimonial-financiero.svg", "Ilustración del área patrimonial y financiera de HiloLegal"],
    hipotecas: ["/area-hipotecas.svg", "Ilustración del área de hipotecas de HiloLegal"],
    "administración de fincas": ["/area-administracion-fincas.svg", "Ilustración del área de administración de fincas de HiloLegal"],
  };
  const IMAGE_HINTS = [
    ["/josecarlos_veronica.webp", 1175, 596, "eager"],
    ["/vero_jurista.webp", 1090, 1366, "lazy"],
    ["/hilolegal-logo-mark.svg", 68, 74, "eager"],
    ["/area-legal.svg", 512, 512, "lazy"],
    ["/area-patrimonial-financiero.svg", 512, 512, "lazy"],
    ["/area-hipotecas.svg", 512, 512, "lazy"],
    ["/area-administracion-fincas.svg", 512, 512, "lazy"],
    ["/nosotros_cliente.webp", 1254, 1254, "lazy"],
  ];

  let applying = false;
  let queued = false;
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

  function setImageHint(img, width, height, loading) {
    if (!img) return;
    img.setAttribute("width", String(width));
    img.setAttribute("height", String(height));
    img.decoding = "async";
    img.loading = loading;
    if (loading === "eager") img.fetchPriority = "high";
  }

  function updateImageHints() {
    document.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      const hint = IMAGE_HINTS.find(([path]) => src.endsWith(path));
      if (hint) setImageHint(img, hint[1], hint[2], hint[3]);
    });
  }

  function addLogos() {
    const headerBrand = document.querySelector("header nav a[href='#']");
    if (headerBrand && !headerBrand.querySelector(".header-logo-mark")) {
      const logo = document.createElement("img");
      logo.className = "header-logo-mark";
      logo.src = LOGO.src;
      logo.alt = LOGO.alt;
      setImageHint(logo, 68, 74, "eager");
      headerBrand.prepend(logo);
    }
    setBrandText(headerBrand);

    const footerBrand = document.querySelector("footer .brand");
    if (footerBrand && !footerBrand.querySelector(".footer-logo-mark")) {
      const logo = document.createElement("img");
      logo.className = "footer-logo-mark";
      logo.src = LOGO.src;
      logo.alt = LOGO.alt;
      setImageHint(logo, 68, 74, "lazy");
      footerBrand.prepend(logo);
    }
    setBrandText(footerBrand);
  }

  function openInNewTab(link) {
    if (link.href.startsWith(window.location.origin)) {
      link.removeAttribute("target");
      link.removeAttribute("rel");
      return;
    }
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  function updateHero() {
    document.querySelectorAll("main > section:first-child p").forEach((p) => {
      const text = norm(p.textContent);
      if (text.includes("planificación financiera, hipotecas") || text.includes("abogados, hipotecas")) p.textContent = HERO_TEXT;
    });
    document.querySelectorAll("main > section:first-child h1 span").forEach((span) => {
      if (span.textContent?.includes("Abogacía")) span.textContent = span.textContent.replace("Abogacía", "Abogados");
      if (span.textContent?.includes("con criterio.")) span.textContent = span.textContent.replace("con criterio.", "con criterio en Altea.");
    });
  }

  function updateLinks() {
    document.querySelectorAll("a").forEach((link) => {
      const text = norm(link.textContent);
      if (text.includes("ver servicios legales")) {
        link.href = VERONICA_SERVICES_URL;
        openInNewTab(link);
        return;
      }
      if (text.includes("conocer a verónica")) {
        link.href = VERONICA_URL;
        openInNewTab(link);
      }
      if (text.includes("conocer a josé carlos") || text.includes("ver asesoramiento patrimonial") || text.includes("ver hipotecas") || text.includes("ver administración de fincas")) {
        link.href = JOSE_CARLOS_URL;
        openInNewTab(link);
      }
    });
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
        art.innerHTML = '<img loading="lazy" decoding="async" width="512" height="512" />';
      }
      if (art.nextElementSibling !== title) card.insertBefore(art, title);
      const img = art.querySelector("img");
      img.src = data[0];
      img.alt = data[1];
      setImageHint(img, 512, 512, "lazy");
    });
  }

  function updatePositionImage() {
    const inner = document.querySelector(".position-block__inner");
    if (!inner) return;
    let media = inner.querySelector(":scope > .position-block__media");
    if (!media) {
      media = document.createElement("div");
      media.className = "position-block__media";
      media.innerHTML = '<img loading="lazy" decoding="async" width="1254" height="1254" />';
      inner.appendChild(media);
    }
    const img = media.querySelector("img");
    img.src = "/nosotros_cliente.webp";
    img.alt = "Equipo de HiloLegal asesorando a un cliente";
    setImageHint(img, 1254, 1254, "lazy");
  }

  function updateText() {
    const toolsIntro = document.querySelector(".tools__heading p");
    if (toolsIntro && norm(toolsIntro.textContent).includes("una web premium")) toolsIntro.textContent = TOOLS_INTRO_TEXT;

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
        if (role) role.textContent = "Gestor patrimonial e hipotecario.";
        const firstBio = card.querySelector(".pros__bio p");
        if (firstBio) firstBio.textContent = JOSE_CARLOS_BIO;
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
    if (/^https?:\/\//i.test(href)) {
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    } else {
      card.removeAttribute("target");
      card.removeAttribute("rel");
    }
  }

  function updateTools() {
    const grid = document.querySelector("#herramientas .tools__grid");
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll(".tool-card"));
    const find = (title) => cards.find((card) => norm(card.querySelector("h3")?.textContent).includes(title));
    const test = find("test de salud financiera");
    const mortgage = find("calculadora hipotecaria") || find("calculadora de ahorro potencial");
    const blog = find("blog financiero");
    const diagnostic = find("diagnóstico patrimonial");
    [mortgage, test, blog, diagnostic].filter(Boolean).forEach((card) => grid.appendChild(card));
    [mortgage, test, blog, diagnostic].filter(Boolean).forEach((card, index) => {
      const number = card.querySelector(".audience__number");
      if (number) number.textContent = `Herramienta ${String(index + 1).padStart(2, "0")}`;
      const cta = card.querySelector(".tools__cta");
      if (card === mortgage) {
        const title = card.querySelector("h3");
        const text = card.querySelector("p");
        if (title) title.textContent = "Calculadora de ahorro potencial";
        if (text) text.textContent = "Calcula cuánto dinero se escapa en pequeños gastos recurrentes y visualiza tu ahorro anual recuperable.";
        enableTool(card, "/herramientas/ahorro-potencial/index.html");
        if (cta) cta.textContent = "→ Abrir calculadora";
      } else if (card === test) {
        enableTool(card, "/test-salud-financiera.html");
        if (cta) cta.textContent = "→ Hacer test";
      } else if (card === blog) {
        enableTool(card, "/blog");
        if (cta) cta.textContent = "→ Leer blog";
      } else if (card === diagnostic) {
        enableTool(card, CALENDLY_URL);
        if (cta) cta.textContent = "→ Solicitar diagnóstico";
      } else if (false) {
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
    updateAreas();
    updatePositionImage();
    updateText();
    updateAudience();
    updateTools();
    updateImageHints();
    window.setTimeout(() => { applying = false; }, 0);
  }

  function scheduleApply() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      apply();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply, { once: true });
  else apply();
  window.addEventListener("load", apply, { once: true });
  [250, 750, 1500, 2600].forEach((delay) => window.setTimeout(apply, delay));
  const observer = new MutationObserver(scheduleApply);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 6000);
})();
