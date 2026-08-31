import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ThemeToggle";
import { blogPosts, SERVICE_META, type BlogService } from "@/lib/blogPosts";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog | HiloLegal" },
      {
        name: "description",
        content:
          "Artículos sobre hipotecas, protección financiera, derecho de familia, civil y penal, y administración de fincas para familias y autónomos en Altea, Benidorm y la Costa Blanca.",
      },
      { property: "og:title", content: "Blog | HiloLegal" },
      {
        property: "og:description",
        content:
          "Financiero e hipotecas, legal y administración de fincas. Artículos prácticos sin tecnicismos.",
      },
      { property: "og:url", content: "https://www.hilolegal.es/blog" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://www.hilolegal.es/blog" }],
  }),
  component: BlogIndex,
});

const FILTERS: { key: BlogService | "all"; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "josecarlos", label: SERVICE_META.josecarlos.label },
  { key: "veronica", label: SERVICE_META.veronica.label },
  { key: "fincas", label: SERVICE_META.fincas.label },
];


const WHATSAPP = "https://wa.me/34647506040";

function BlogIndex() {
  const [filter, setFilter] = useState<BlogService | "all">("all");
  const posts = filter === "all" ? blogPosts : blogPosts.filter((p) => p.service === filter);

  return (
    <div className="blog-editorial min-h-screen">
      <header className="sticky top-0 z-50 backdrop-blur-xl">
        <nav className="flex justify-between items-center w-full px-6 py-5 max-w-[1500px] mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo-black.svg" alt="Logo" className="h-9 w-9 object-contain" />
            <span className="text-base md:text-lg font-bold tracking-tight uppercase">
              HiloLegal
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/" className="blog-editorial__back">
              ← Volver al inicio
            </Link>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="header-whatsapp-btn hidden rounded-full bg-[#1f6f78] px-8 py-[1.1rem] text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#17535a] sm:inline-block"
            >
              WhatsApp
            </a>
          </div>
        </nav>
      </header>

      <main className="blog-editorial__main">
        <div className="blog-editorial__heading">
          <span>Blog</span>
          <h1>Decisiones claras, sin tecnicismos.</h1>
          <p>
            Artículos sobre hipotecas y finanzas, derecho civil, familia y penal, y
            administración de fincas para familias y autónomos.
          </p>
        </div>

        <div className="blog-editorial__filters" role="group" aria-label="Filtrar por servicio">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => {
                setFilter(f.key);
                trackEvent("blog_article_click", { filter: f.key });
              }}
              aria-pressed={filter === f.key}
              className={`blog-editorial__filter ${filter === f.key ? "blog-editorial__filter--active" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="blog-editorial__grid">
          {posts.map((post, index) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="blog-editorial__card"
              onClick={() => trackEvent("blog_article_click", { slug: post.slug })}
            >
              <div className="blog-editorial__meta">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{post.category} · {post.readingTime}</span>
              </div>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <span className="blog-editorial__cta">
                <span aria-hidden="true" />
                Leer artículo
              </span>
            </Link>
          ))}
        </div>
      </main>

      <footer className="blog-editorial__footer">
        <div>
          © {new Date().getFullYear()} HiloLegal. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
