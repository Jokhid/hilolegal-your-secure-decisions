import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  // p-1.5 + -m-1.5: zona pulsable de 32×32 px (WCAG 2.5.8 pide 24×24) sin mover
  // nada en la barra, porque el margen negativo compensa el relleno.
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      className={`-m-1.5 inline-flex items-center justify-center p-1.5 text-[#1A1A1A] transition-colors hover:text-[#C5A566] ${className}`}
    >
      {isLight ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}
