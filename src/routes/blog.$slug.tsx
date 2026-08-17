import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { blogPosts, findPost } from "@/lib/blogPosts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = findPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    const title = post ? `${post.title} | Blog HiloLegal` : "Artículo";
    const desc = post?.metaDescription ?? "";
    const url = `https://hilolegal.es/blog/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: post?.title ?? "Artículo" },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: post
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: post.title,
                description: post.metaDescription,
                articleSection: post.category,
                author: {
                  "@type": "Person",
                  name: "José Carlos Hidalgo Ortega",
                  url: "https://hilolegal.es/josecarlos/",
                },
                publisher: {
                  "@type": "Organization",
                  name: "HiloLegal",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://hilolegal.es/logo.png",
                  },
                },
                mainEntityOfPage: url,
              }),
            },
          ]
        : [],
    };
  },
  component: BlogPostPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <Link to="/blog" className="text-[#C5A566] underline">
        Volver al blog
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <Link to="/blog" className="text-[#C5A566] underline">
        Volver al blog
      </Link>
    </div>
  ),
});

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
          className="border-l-4 border-[#C5A566] pl-6 my-8 italic text-xl text-[#1A1A1A]"
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
          className={`my-6 space-y-2 ${isOrdered ? "list-decimal" : "list-disc"} pl-6 text-lg text-[#4A4A4A]`}
        >
          {items.map((it, idx) => (
            <li key={idx}>{inline(it)}</li>
          ))}
        </ListTag>,
      );
    } else {
      blocks.push(
        <p key={key++} className="my-5 text-lg leading-relaxed text-[#4A4A4A]">
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
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="blog-post min-h-screen">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#E5E5E5]">
        <nav className="flex justify-between items-center w-full px-6 py-5 max-w-[1200px] mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo-black.svg" alt="Logo" className="h-9 w-9 object-contain" />
            <span className="text-base md:text-lg font-bold tracking-tight uppercase">
              HiloLegal
            </span>
          </Link>
          <Link
            to="/blog"
            className="blog-post__back"
          >
            ← Blog
          </Link>
        </nav>
      </header>

      <main className="max-w-[760px] mx-auto px-6 py-16">
        <article>
          <div className="space-y-6 mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A566]">
              {post.category} · {post.readingTime}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              {post.title}
            </h1>
            <p className="text-xl text-[#4A4A4A] leading-relaxed">{post.excerpt}</p>
            <div className="w-20 h-1 bg-[#C5A566]" />
          </div>

          <div className="prose-content">{renderMarkdown(post.content)}</div>

          <div className="mt-16 pt-10 border-t border-[#E5E5E5]">
            <Link
              to="/"
              hash="contact"
              className="inline-block bg-[#C5A566] text-white px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-[#1A1A1A] transition-colors"
            >
              Quiero mi diagnóstico gratuito
            </Link>
          </div>
        </article>

        {related.length > 0 && (
          <aside className="mt-24 pt-12 border-t border-[#E5E5E5]">
            <h2 className="text-2xl font-bold mb-8 uppercase tracking-tight">
              Sigue leyendo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="block border border-[#E5E5E5] p-6 hover:border-[#C5A566] transition-colors"
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A566]">
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
