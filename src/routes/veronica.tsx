import { createFileRoute, Link } from "@tanstack/react-router";

const services = [
  "Derecho civil y patrimonial",
  "Familia y sucesiones",
  "Inmobiliario y vivienda",
  "Administrativo y relaciones con la Administración",
  "Comunidades de propietarios",
];

export const Route = createFileRoute("/veronica")({
  head: () => ({
    meta: [
      { title: "Verónica López | HiloLegal" },
      {
        name: "description",
        content:
          "Verónica López, abogada en HiloLegal. Asesoramiento jurídico civil, familiar, inmobiliario, administrativo y patrimonial.",
      },
      { property: "og:title", content: "Verónica López | HiloLegal" },
      {
        property: "og:description",
        content:
          "Abogada con experiencia jurídica, institucional y docente para asuntos legales con impacto personal o patrimonial.",
      },
      { property: "og:url", content: "https://hilolegal.es/veronica/" },
      { property: "og:type", content: "profile" },
    ],
    links: [{ rel: "canonical", href: "https://hilolegal.es/veronica/" }],
  }),
  component: VeronicaPage,
});

function VeronicaPage() {
  return (
    <div className="profile-page">
      <header className="profile-page__header">
        <nav>
          <Link to="/" className="profile-page__brand">
            <img src="/logo.png" alt="Logo HiloLegal" />
            <span>HiloLegal</span>
          </Link>
          <Link to="/" className="profile-page__back">
            Volver al inicio
          </Link>
        </nav>
      </header>

      <main>
        <section className="profile-hero">
          <div>
            <span className="profile-page__eyebrow">Socia · Abogada</span>
            <h1>Verónica López</h1>
            <p>
              Abogada con más de 20 años de experiencia jurídica, trayectoria en puestos de alta
              responsabilidad en la Administración de Justicia y actividad docente como profesora
              asociada en la Facultad de Derecho de Alicante.
            </p>
            <div className="profile-page__actions">
              <Link to="/" hash="contact">
                Solicitar diagnóstico
              </Link>
              <a href="#services">Ver servicios</a>
            </div>
          </div>
          <figure>
            <img src="/vero_jurista.webp" alt="Verónica López" loading="eager" />
          </figure>
        </section>

        <section className="profile-section" id="services">
          <div className="profile-section__intro">
            <span className="profile-page__eyebrow">Servicios legales</span>
            <h2>Rigor jurídico para decisiones personales y patrimoniales.</h2>
          </div>
          <div className="profile-grid">
            {services.map((service, index) => (
              <article className="profile-card" key={service}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{service}</h3>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
