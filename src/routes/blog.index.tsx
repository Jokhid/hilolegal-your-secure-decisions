import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ThemeToggle";
import { blogPosts, topicOf, TOPIC_LABEL, type BlogTopic } from "@/lib/blogPosts";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog | HiloLegal" },
      {
        name: "description",
        content:
          "Derecho, hipotecas, patrimonio y comunidades explicados con claridad. Artículos para entender antes de decidir, para familias y autónomos.",
      },
      { property: "og:title", content: "Blog | HiloLegal" },
      {
        property: "og:description",
        content:
          "Legal, hipotecas, patrimonio, autónomos y comunidades. Artículos prácticos sin tecnicismos.",
      },
      { property: "og:url", content: "https://www.hilolegal.es/blog" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:site_name", content: "HiloLegal" },
      { property: "og:image", content: "https://www.hilolegal.es/fotoalteadespachohorizontal.webp" },
      { property: "og:image:width", content: "1536" },
      { property: "og:image:height", content: "1024" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Blog | HiloLegal" },
      {
        name: "twitter:description",
        content: "Legal, hipotecas, patrimonio, autónomos y comunidades. Artículos prácticos sin tecnicismos.",
      },
      { name: "twitter:image", content: "https://www.hilolegal.es/fotoalteadespachohorizontal.webp" },
    ],
    links: [{ rel: "canonical", href: "https://www.hilolegal.es/blog" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.hilolegal.es/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.hilolegal.es/blog" },
          ],
        }),
      },
    ],
  }),
  component: BlogIndex,
});

const FILTERS: { key: BlogTopic | "all"; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "legal", label: TOPIC_LABEL.legal },
  { key: "hipotecas", label: TOPIC_LABEL.hipotecas },
  { key: "patrimonio", label: TOPIC_LABEL.patrimonio },
  { key: "autonomos", label: TOPIC_LABEL.autonomos },
  { key: "comunidades", label: TOPIC_LABEL.comunidades },
];


const WHATSAPP = "https://wa.me/34647506040";

function BlogIndex() {
  const [filter, setFilter] = useState<BlogTopic | "all">("all");
  const posts = filter === "all" ? blogPosts : blogPosts.filter((p) => topicOf(p) === filter);

  return (
    <div className="blog-editorial min-h-screen">
      <header className="sticky top-0 z-50 backdrop-blur-xl">
        <nav className="flex justify-between items-center w-full px-6 py-5 max-w-[1500px] mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img src="/hilolegal-logo-stacked-black.webp" alt="Logo HiloLegal" className="h-8 w-auto object-contain" />
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
          <span>Blog HiloLegal</span>
          <h1>Entender antes de decidir.</h1>
          <p>
            Derecho, hipotecas, patrimonio y comunidades explicados con claridad. Analizamos
            cuestiones que pueden afectar a tu familia, tu vivienda, tu patrimonio o tu comunidad
            para ayudarte a entender mejor las decisiones antes de tomarlas.
          </p>
        </div>

        <div className="blog-editorial__filters" role="group" aria-label="Filtrar por categoría">
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
