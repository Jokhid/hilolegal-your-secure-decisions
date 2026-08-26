import * as React from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "hilolegal-theme";

export function useTheme() {
  const [theme, setTheme] = React.useState<Theme>("light");

  React.useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      if (next === "light") {
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore (private browsing, storage disabled, etc.)
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
