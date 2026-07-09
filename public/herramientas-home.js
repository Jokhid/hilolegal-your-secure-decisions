(() => {
  const GOLD = "#C5A566";
  const TOOLS_HREF = "/#herramientas";
  const ICONS = {
    savings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11a7 7 0 0 1 14 0c0 5-7 10-7 10s-7-5-7-10Z"/><path d="M12 8v6"/><path d="M9.5 10.5h3.25a1.75 1.75 0 0 1 0 3.5H10"/><path d="M16.5 5.5 18 3"/><path d="M7.5 5.5 6 3"/></svg>',
    health_and_safety: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M12 7v8"/><path d="M8 11h8"/></svg>',
    real_estate_agent: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>',
    arrow_forward: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>',
  };

  function injectStyles() {
    if (document.getElementById("jc-tools-styles")) return;
    const style = document.createElement("style");
    style.id = "jc-tools-styles";
    style.textContent = `
      #herramientas { background: #ffffff; border-top: 1px solid #e5e5e5; color: #1a1a1a; padding: 100px 0; }
      .jc-tools-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
      .jc-tools-kicker { color: ${GOLD}; font-size: 12px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase; margin: 0 0 24px; }
      .jc-tools-title { max-width: 860px; margin: 0; font-size: clamp(2.35rem, 5vw, 4.6rem); line-height: 0.95; font-weight: 900; letter-spacing: -0.035em; }
      .jc-tools-title__accent { color: ${GOLD}; }
      .jc-tools-intro { max-width: 720px; margin: 28px 0 72px; color: #4a4a4a; font-size: clamp(1.05rem, 2vw, 1.35rem); line-height: 1.65; }
      .services-editorial__card h3 { color: ${GOLD} !important; }
      .services-editorial__card p { color: #ffffff !important; }
      #faq button, #faq button > span:first-child { color: ${GOLD} !important; }
      #faq button + div, #faq button + div div { color: #ffffff !important; }
      main > section:nth-of-type(3) h2 { overflow: visible !important; padding-right: .25em; }
      main > section:nth-of-type(3) h2 .overflow-hidden { overflow: visible !important; padding-right: .25em; }
      [data-jc-tools-link="true"] svg, [data-jc-close-button="true"] svg, [data-jc-menu-button="true"] svg, [data-jc-menu-title-icon="true"] svg, [data-jc-mobile-nav-icon="true"] svg { width: 1.25rem; height: 1.25rem; display: block; flex: 0 0 auto; }
      [data-jc-menu-button="true"] svg, [data-jc-close-button="true"] svg { width: 1.875rem; height: 1.875rem; }
      [data-jc-mobile-tools-link="true"] [data-jc-mobile-nav-icon="true"] svg { width: 1.5rem; height: 1.5rem; }
      [data-jc-menu-title-icon="true"] { display: inline-flex !important; align-items: center; justify-content: center; color: #1A1A1A !important; }
      [data-jc-menu-title-icon="true"] svg { width: 1.5rem; height: 1.5rem; }
      [data-jc-close-button="true"] { color: #1A1A1A !important; background: rgba(255, 255, 255, 0.9) !important; display: inline-flex !important; align-items: center; justify-content: center; }
      [data-jc-close-button="true"]:hover { color: #ffffff !important; background: #FF6B00 !important; }
      [data-jc-mobile-tools-link="true"] { animation: jc-mobile-nav-in 560ms cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 455ms; will-change: opacity, transform; }
      @keyframes jc-mobile-nav-in { from { opacity: 0; transform: translateX(54px); } to { opacity: 1; transform: translateX(0); } }
      @media (max-width: 640px) { main > section:nth-of-type(3) h2 { max-width: 100% !important; font-size: clamp(1.45rem, 8.4vw, 2.15rem) !important; line-height: 1.08 !important; } main > section:nth-of-type(3) h2 span { white-space: nowrap; } }
      .jc-tools-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; background: #e5e5e5; border: 1px solid #e5e5e5; }
      .jc-tool-card { min-height: 360px; display: flex; flex-direction: column; align-items: flex-start; background: #ffffff; color: #1a1a1a; padding: 40px; text-decoration: none; transition: background-color 240ms ease, color 240ms ease, transform 240ms ease; }
      a.jc-tool-card:hover { background: #1a1a1a; color: #ffffff; transform: translateY(-4px); }
      .jc-tool-icon { width: 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center; color: ${GOLD}; margin-bottom: 32px; }
      .jc-tool-icon svg, .jc-tool-action svg { width: 1em; height: 1em; display: block; }
      .jc-tool-icon svg { width: 44px; height: 44px; }
      .jc-tool-card h3 { margin: 0 0 18px; font-size: 26px; line-height: 1.08; font-weight: 900; letter-spacing: -0.02em; }
      .jc-tool-card p { margin: 0 0 36px; color: #4a4a4a; font-size: 16px; line-height: 1.65; transition: color 240ms ease; }
      a.jc-tool-card:hover p { color: rgba(255, 255, 255, 0.76); }
      .jc-tool-action { margin-top: auto; display: inline-flex; align-items: center; gap: 8px; color: inherit; font-size: 12px; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; }
      .jc-tool-card[aria-disabled="true"] .jc-tool-action { color: #9a9a9a; }
      @media (max-width: 900px) { #herramientas { padding: 80px 0; } .jc-tools-grid { grid-template-columns: 1fr; } .jc-tool-card { min-height: auto; padding: 32px; } }
    `;
    document.head.appendChild(style);
  }

  function isMobileMenuLink(link) {
    return Boolean(link.closest('[role="dialog"]')) || link.className.toString().includes("rounded-2xl");
  }

  function replaceIcon(element, icon, attribute) {
    element.setAttribute(attribute, "true");
    if (element.getAttribute("data-jc-icon-enhanced") === icon) return;
    element.setAttribute("data-jc-icon-enhanced", icon);
    element.innerHTML = ICONS[icon];
  }

  function enhanceMobileMenuIcons() {
    document.querySelectorAll('button[aria-label="Abrir menú"]').forEach((button) => {
      if (button instanceof HTMLButtonElement) replaceIcon(button, "menu", "data-jc-menu-button");
    });
    document.querySelectorAll('[role="dialog"] button[aria-label="Cerrar menú"]').forEach((button) => {
      if (!(button instanceof HTMLButtonElement) || button.className.toString().includes("absolute inset-0")) return;
      replaceIcon(button, "close", "data-jc-close-button");
    });
    document.querySelectorAll('[role="dialog"] .material-symbols-outlined').forEach((icon) => {
      const name = icon.textContent ? icon.textContent.trim() : "";
      if (name === "arrow_forward") replaceIcon(icon, "arrow_forward", "data-jc-mobile-nav-icon");
      if (name === "close") replaceIcon(icon, "close", "data-jc-mobile-nav-icon");
      if (name === "menu") replaceIcon(icon, "menu", "data-jc-mobile-nav-icon");
    });
    document.querySelectorAll('[role="dialog"] span').forEach((span) => {
      if (!(span instanceof HTMLSpanElement)) return;
      if (span.textContent && span.textContent.trim() === "Menú" && span.className.toString().includes("uppercase")) {
        span.setAttribute("aria-hidden", "true");
        replaceIcon(span, "menu", "data-jc-menu-title-icon");
      }
    });
  }

  function paintToolsLink(link, faqLink) {
    const mobile = isMobileMenuLink(faqLink || link);
    link.setAttribute("href", TOOLS_HREF);
    link.setAttribute("data-jc-tools-link", "true");
    link.className = faqLink.className;
    link.removeAttribute("style");
    link.removeAttribute("data-jc-mobile-tools-link");
    if (mobile) {
      link.setAttribute("data-jc-mobile-tools-link", "true");
      link.innerHTML = `<span class="absolute inset-0 origin-right scale-x-0 bg-[#FF6B00] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"></span><span class="relative z-10 flex items-center justify-between transition-colors group-hover:text-white">Herramientas<span aria-hidden="true" class="material-symbols-outlined text-xl text-[#FF6B00] transition-colors group-hover:text-white">arrow_forward</span></span>`;
    } else {
      link.innerHTML = `<span class="transition-colors group-hover:text-[#FF6B00]">Herramientas</span><span class="absolute -bottom-1 left-0 h-[1px] w-full origin-left scale-x-0 bg-[#FF6B00] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"></span>`;
    }
  }

  function ensureToolsNav() {
    document.querySelectorAll('a[href="/#faq"]').forEach((faqLink) => {
      const parent = faqLink.parentElement;
      if (!parent) return;
      const existingToolsLink = parent.querySelector('a[href="/#herramientas"]');
      if (existingToolsLink) {
        const needsMobileRefresh = isMobileMenuLink(existingToolsLink) && !existingToolsLink.querySelector('.material-symbols-outlined');
        if (existingToolsLink.getAttribute("data-jc-tools-link") !== "true" || !existingToolsLink.textContent.includes("Herramientas") || needsMobileRefresh) paintToolsLink(existingToolsLink, faqLink);
        return;
      }
      const link = document.createElement("a");
      paintToolsLink(link, faqLink);
      if (isMobileMenuLink(faqLink)) {
        link.addEventListener("click", () => {
          const closeButton = document.querySelector('[role="dialog"] button[aria-label="Cerrar menú"][data-jc-close-button="true"]');
          if (closeButton instanceof HTMLButtonElement) closeButton.click();
        });
      }
      faqLink.insertAdjacentElement("afterend", link);
    });
  }

  function ensureToolsSection() {
    if (document.getElementById("herramientas")) return;
    const faq = document.getElementById("faq");
    if (!faq || !faq.parentElement) return;
    const section = document.createElement("section");
    section.id = "herramientas";
    section.innerHTML = `<div class="jc-tools-wrap"><p class="jc-tools-kicker">Herramientas</p><h2 class="jc-tools-title">Herramientas para <span class="jc-tools-title__accent">decidir con números</span>, no por intuición</h2><p class="jc-tools-intro">Recursos prácticos para medir ahorro, vulnerabilidad financiera y escenarios hipotecarios antes de tomar decisiones importantes.</p><div class="jc-tools-grid"><a class="jc-tool-card" href="/herramientas/ahorro-potencial/"><span class="jc-tool-icon" aria-hidden="true">${ICONS.savings}</span><h3>Calculadora de ahorro potencial</h3><p>Calcula cuánto dinero se escapa en pequeños gastos recurrentes y visualiza tu ahorro anual recuperable.</p><span class="jc-tool-action">Abrir calculadora <span aria-hidden="true">${ICONS.arrow_forward}</span></span></a><article class="jc-tool-card" aria-disabled="true"><span class="jc-tool-icon" aria-hidden="true">${ICONS.health_and_safety}</span><h3>Test de vulnerabilidad financiera</h3><p>Detecta puntos débiles en ingresos, protección y planificación para saber dónde conviene actuar primero.</p><span class="jc-tool-action">Próximamente</span></article><article class="jc-tool-card" aria-disabled="true"><span class="jc-tool-icon" aria-hidden="true">${ICONS.real_estate_agent}</span><h3>Calculadora hipotecaria</h3><p>Estima cuota, intereses y escenarios de financiación para valorar una hipoteca con más criterio.</p><span class="jc-tool-action">Próximamente</span></article></div></div>`;
    faq.insertAdjacentElement("afterend", section);
  }

  function enhanceHome() {
    if (window.location.pathname !== "/") return;
    injectStyles();
    ensureToolsNav();
    ensureToolsSection();
    enhanceMobileMenuIcons();
  }

  function scheduleMenuEnhance() {
    window.setTimeout(enhanceHome, 0);
    window.setTimeout(enhanceHome, 90);
    window.setTimeout(enhanceHome, 240);
  }

  enhanceHome();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhanceHome, { once: true });
  }
  window.setTimeout(enhanceHome, 160);
  window.setTimeout(enhanceHome, 700);

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    if (target.closest('button[aria-label="Abrir menú"], [role="dialog"]')) scheduleMenuEnhance();
  }, true);
})();