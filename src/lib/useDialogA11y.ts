import { useEffect, useRef } from "react";

// Comportamiento mínimo de WAI-ARIA APG para diálogos modales (drawer móvil,
// chat) que este proyecto no tenía: cerrar con Escape, mover el foco al
// panel al abrirse y devolverlo al elemento que lo abrió al cerrarse.
// `containerRef` debe apuntar al elemento con role="dialog"; ese elemento
// necesita tabIndex={-1} para poder recibir foco si no contiene ningún
// elemento enfocable por sí mismo.
export function useDialogA11y(
  isOpen: boolean,
  onClose: () => void,
  containerRef: React.RefObject<HTMLElement | null>,
) {
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    triggerRef.current = document.activeElement;

    const el = containerRef.current;
    const focusable = el?.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    (focusable ?? el)?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
}
