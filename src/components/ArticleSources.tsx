import type { ArticleSource } from "@/lib/blogPosts";

// Solo se renderiza cuando el artículo declara fuentes reales en su ficha
// (blogPosts.ts). No hay fuentes por defecto ni enlaces inventados.
export function ArticleSources({ sources }: { sources?: ArticleSource[] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-10 pt-8 border-t border-[#E5E5E5]">
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#8A8A8A] mb-3">
        Fuentes consultadas
      </h2>
      <ul className="space-y-2">
        {sources.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--jch-cta)] hover:text-[var(--jch-ink)] underline underline-offset-2 transition-colors"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
