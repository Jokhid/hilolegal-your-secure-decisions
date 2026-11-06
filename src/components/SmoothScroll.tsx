import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    // Quien tiene activado "reducir movimiento" en su sistema (por mareo o sensibilidad al
    // movimiento) no debe recibir el desplazamiento con inercia: se deja el scroll nativo del
    // navegador y ni siquiera se arranca el bucle de animación. El resto de animaciones de la
    // web (Framer Motion, el carrusel) ya respetaban este ajuste; esta era la que no. Si la
    // persona cambia el ajuste con la página abierta, se activa o desactiva al momento.
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stopLenis: (() => void) | undefined;

    const start = () => {
      if (stopLenis) return;
      const lenis = new Lenis({
        duration: 1.25,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      let rafId: number;
      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      stopLenis = () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
        stopLenis = undefined;
      };
    };

    const sync = () => {
      if (query.matches) stopLenis?.();
      else start();
    };

    sync();
    query.addEventListener("change", sync);

    return () => {
      query.removeEventListener("change", sync);
      stopLenis?.();
    };
  }, []);

  return null;
}
