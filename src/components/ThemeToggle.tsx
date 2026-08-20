import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      className={`inline-flex items-center justify-center text-[#1A1A1A] transition-colors hover:text-[#C5A566] ${className}`}
    >
      {isLight ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}
