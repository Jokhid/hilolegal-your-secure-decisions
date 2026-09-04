import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArticleSources } from "@/components/ArticleSources";
import { blogPosts, findPost, SERVICE_META } from "@/lib/blogPosts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = findPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    const title = post ? `${shortTitle(post.title)} | HiloLegal` : "Artículo";
    const desc = post?.metaDescription ?? "";
    const url = `https://www.hilolegal.es/blog/${params.slug}`;
    const author = post ? SERVICE_META[post.service] : null;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: post?.title ?? "Artículo" },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "es_ES" },
        { property: "og:site_name", content: "HiloLegal" },
        ...(post && author
          ? [
              { property: "og:image", content: author.ogImage },
              { property: "og:image:width", content: String(author.ogImageWidth) },
              { property: "og:image:height", content: String(author.ogImageHeight) },
              { name: "twitter:card", content: "summary_large_image" },
              { name: "twitter:title", content: post?.title ?? "Artículo" },
              { name: "twitter:description", content: desc },
              { name: "twitter:image", content: author.ogImage },
              { property: "article:published_time", content: post.publishedAt },
              ...(post.updatedAt ? [{ property: "article:modified_time", content: post.updatedAt }] : []),
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: post && author
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: post.title,
                description: post.metaDescription,
                image: author.ogImage,
                articleSection: post.category,
                datePublished: post.publishedAt,
                author: {
                  "@type": "Person",
                  name: author.authorName,
                  url: author.authorUrl,
                },
                publisher: {
                  "@type": "Organization",
                  name: "HiloLegal",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://www.hilolegal.es/logo.png",
                  },
                },
                mainEntityOfPage: url,
                ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
              }),
            },
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.hilolegal.es/" },
                  { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.hilolegal.es/blog" },
                  { "@type": "ListItem", position: 3, name: post.title, item: url },
                ],
              }),
            },
          ]
        : [],
    };
  },
  component: BlogPostPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <Link to="/blog" className="text-[var(--jch-accent-ink)] underline">
        Volver al blog
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <Link to="/blog" className="text-[var(--jch-accent-ink)] underline">
        Volver al blog
      </Link>
    </div>
  ),
});

const SPANISH_MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

// post.updatedAt/publishedAt se guardan en ISO (YYYY-MM-DD) para que sirvan
// tal cual como datePublished/dateModified en el JSON-LD; esta función los
// convierte a formato legible en español solo para mostrarlos en pantalla.
function formatSpanishDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} de ${SPANISH_MONTHS[m - 1]} de ${y}`;
}

// Título corto para la etiqueta <title> (Google trunca en torno a 60
// caracteres) sin tener que reescribir a mano los 25 posts — corta en el
// último espacio antes del límite. El <h1> sigue mostrando post.title
// completo, sin recortar.
function shortTitle(title: string, max = 44) {
  if (title.length <= max) return title;
  const cut = title.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 24 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

const SERVICE_CTA: Record<string, string> = {
  josecarlos: "Quiero mi análisis gratuito",
  veronica: "Cuéntanos tu caso",
  fincas: "Solicitar propuesta",
};

function renderMarkdown(md: string) {
  const lines = md.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  const inline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((p, idx) => {
      if (p.startsWith("**") && p.endsWith("**"))
        return <strong key={idx}>{p.slice(2, -2)}</strong>;
      if (p.startsWith("*") && p.endsWith("*") && p.length > 2)
        return <em key={idx}>{p.slice(1, -1)}</em>;
      return p;
    });
  };

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={key++} className="text-3xl font-bold mt-14 mb-6 tracking-tight">
          {line.slice(3)}
        </h2>,
      );
      i++;
    } else if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={key++} className="text-2xl font-bold mt-10 mb-4">
          {line.slice(4)}
        </h3>,
      );
      i++;
    } else if (line.startsWith("#### ")) {
      blocks.push(
        <h4 key={key++} className="text-xl font-bold mt-8 mb-3">
          {line.slice(5)}
        </h4>,
      );
      i++;
    } else if (line.startsWith("> ")) {
      blocks.push(
        <blockquote
          key={key++}
          className="border-l-4 border-[#C5A566] pl-6 my-8 italic text-xl text-[var(--jch-ink)]"
        >
          {inline(line.slice(2))}
        </blockquote>,
      );
      i++;
    } else if (/^(-|\d+\.) /.test(line)) {
      const isOrdered = /^\d+\. /.test(line);
      const items: string[] = [];
      while (i < lines.length && /^(-|\d+\.) /.test(lines[i])) {
        items.push(lines[i].replace(/^(-|\d+\.) /, ""));
        i++;
      }
      const ListTag = isOrdered ? "ol" : "ul";
      blocks.push(
        <ListTag
          key={key++}
          className={`my-6 space-y-2 ${isOrdered ? "list-decimal" : "list-disc"} pl-6 text-lg text-[var(--jch-muted)]`}
        >
          {items.map((it, idx) => (
            <li key={idx}>{inline(it)}</li>
          ))}
        </ListTag>,
      );
    } else {
      blocks.push(
        <p key={key++} className="my-5 text-lg leading-relaxed text-[var(--jch-muted)]">
          {inline(line)}
        </p>,
      );
      i++;
    }
  }
  return blocks;
}

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const others = blogPosts.filter((p) => p.slug !== post.slug);
  const sameService = others.filter((p) => p.service === post.service);
  const rest = others.filter((p) => p.service !== post.service);
  const related = [...sameService, ...rest].slice(0, 3);
  const author = SERVICE_META[post.service];

  return (
    <div className="blog-post min-h-screen">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#E5E5E5]">
        <nav className="flex justify-between items-center w-full px-6 py-5 max-w-[1200px] mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img src="/hilolegal-logo-stacked-black.webp" alt="Logo HiloLegal" className="h-12 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/blog"
              className="blog-post__back"
            >
              ← Blog
            </Link>
            <a
              href="https://wa.me/34647506040"
              target="_blank"
              rel="noopener noreferrer"
              className="header-whatsapp-btn hidden rounded-full bg-[#1f6f78] px-8 py-[1.1rem] text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#17535a] sm:inline-block"
            >
              WhatsApp
            </a>
          </div>
        </nav>
      </header>

      <main className="max-w-[760px] mx-auto px-6 py-16">
        <article>
          <div className="space-y-6 mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-accent-ink)]">
              {post.category} · {post.readingTime}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              {post.title}
            </h1>
            <p className="text-xl text-[var(--jch-muted)] leading-relaxed">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--jch-dim)]">
              <span>
                Por{" "}
                <Link to={author.contactPath} className="font-bold text-[var(--jch-ink)] hover:text-[var(--jch-cta)] transition-colors">
                  {author.authorName}
                </Link>
              </span>
              {post.updatedAt && <span>· Revisado el {formatSpanishDate(post.updatedAt)}</span>}
            </div>
            <div className="w-20 h-1 bg-[#C5A566]" />
          </div>

          <div className="prose-content">{renderMarkdown(post.content)}</div>

          <ArticleSources sources={post.sources} />

          <div className="mt-16 pt-10 border-t border-[var(--jch-line)] flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1A1A1A] text-sm font-black uppercase text-white">
              {author.authorName.charAt(0)}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-1">
                Sobre el autor
              </p>
              <Link
                to={author.contactPath}
                className="font-bold text-[var(--jch-ink)] hover:text-[var(--jch-cta)] transition-colors"
              >
                {author.authorName}
              </Link>
              <p className="mt-1 text-sm text-[var(--jch-muted)] leading-relaxed">{author.authorBio}</p>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-[var(--jch-line)]">
            <Link
              to={author.contactPath}
              hash="contact"
              className="inline-block rounded-full bg-[#1f6f78] text-white px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-[#17535a] transition-colors"
            >
              {SERVICE_CTA[post.service] ?? "Cuéntanos tu caso"}
            </Link>
          </div>
        </article>

        {related.length > 0 && (
          <aside className="mt-24 pt-12 border-t border-[var(--jch-line)]">
            <h2 className="text-2xl font-bold mb-8 uppercase tracking-tight">
              Sigue leyendo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="block border border-[var(--jch-line)] p-6 hover:border-[#C5A566] transition-colors"
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-accent-ink)]">
                    {r.category}
                  </span>
                  <h3 className="mt-3 font-bold leading-snug">{r.title}</h3>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </main>

      <footer className="bg-[#1A1A1A] py-12 text-white mt-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center text-[10px] uppercase tracking-widest text-gray-500">
          © {new Date().getFullYear()} HiloLegal. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
