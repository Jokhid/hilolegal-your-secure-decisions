(() => {
  const STYLE_ID = "ochre-window-style";
  const TARGET_SELECTOR = [
    "main h1 > .relative.inline-block",
    "main h2 .relative.inline-block",
    "main h3 .relative.inline-block",
  ].join(",");

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .ochre-window {
        position: relative;
        isolation: isolate;
      }

      .ochre-window::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 4;
        pointer-events: none;
        background: var(--jch-accent, #c5a566);
        transform: scaleY(1);
        transform-origin: top;
        transition: transform 1.05s cubic-bezier(.16, 1, .3, 1);
        transition-delay: var(--ochre-delay, 0ms);
      }

      .ochre-window.ochre-window--visible::after {
        transform: scaleY(0);
      }

      @media (prefers-reduced-motion: reduce) {
        .ochre-window::after {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function getTargets() {
    return Array.from(document.querySelectorAll(TARGET_SELECTOR)).filter((node) => {
      if (!(node instanceof HTMLElement)) return false;
      return node.textContent && node.textContent.trim().length > 0;
    });
  }

  function applyWindows() {
    installStyles();

    const targets = getTargets();
    targets.forEach((target, index) => {
      if (target.dataset.ochreWindow === "true") return;

      target.dataset.ochreWindow = "true";
      target.classList.add("ochre-window");
      target.style.setProperty("--ochre-delay", `${Math.min(index % 4, 3) * 90}ms`);
    });

    revealWhenVisible(targets);
  }

  let observer;
  function revealWhenVisible(targets) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => target.classList.add("ochre-window--visible"));
      return;
    }

    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("ochre-window--visible");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.28, rootMargin: "0px 0px -8% 0px" },
      );
    }

    targets.forEach((target) => {
      if (!target.classList.contains("ochre-window--visible")) observer.observe(target);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyWindows, { once: true });
  } else {
    applyWindows();
  }

  window.addEventListener("load", applyWindows, { once: true });
  window.setTimeout(applyWindows, 250);
  window.setTimeout(applyWindows, 900);

  const mutationObserver = new MutationObserver(applyWindows);
  mutationObserver.observe(document.documentElement, { childList: true, subtree: true });
})();
