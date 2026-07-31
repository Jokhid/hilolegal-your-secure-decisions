import { createFileRoute, Link } from "@tanstack/react-router";

const tools = [
  ["Calculadora de ahorro potencial", "/herramientas/ahorro-potencial/index.html"],
  ["Test de salud financiera", "/test-salud-financiera.html"],
  ["Blog financiero", "/blog"],
] as const;

const services = [
  "Planificación financiera familiar",
  "Hipotecas y compra de vivienda",
  "Seguros, protección de ingresos y autónomos",
  "Ahorro, pensiones y previsión patrimonial",
  "Administración de fincas y comunidades",
];

export const Route = createFileRoute("/josecarlos")({
  head: () => ({
    meta: [
      { title: "José Carlos Hidalgo | HiloLegal" },
      {
        name: "description",
        content:
          "Asesor financiero, hipotecario y patrimonial en HiloLegal. Planificación financiera, hipotecas, seguros, ahorro y administración de fincas.",
      },
      { property: "og:title", content: "José Carlos Hidalgo | HiloLegal" },
      {
        property: "og:description",
        content:
          "Asesoramiento financiero, hipotecario y patrimonial para familias, autónomos, propietarios y comunidades.",
      },
      { property: "og:url", content: "https://hilolegal.es/josecarlos/" },
      { property: "og:type", content: "profile" },
    ],
    links: [{ rel: "canonical", href: "https://hilolegal.es/josecarlos/" }],
  }),
  component: JoseCarlosPage,
});

function JoseCarlosPage() {
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
            <span className="profile-page__eyebrow">Socio · Financiero</span>
            <h1>José Carlos Hidalgo</h1>
            <p>
              Asesor financiero, hipotecario y patrimonial. Ayuda a familias, autónomos,
              propietarios y comunidades a ordenar decisiones económicas importantes con una mirada
              práctica, realista y conectada con el impacto legal y patrimonial.
            </p>
            <div className="profile-page__actions">
              <a href="https://calendly.com/jchidalgo/plan" target="_blank" rel="noopener noreferrer">
                Agendar diagnóstico
              </a>
              <Link to="/blog">Leer blog</Link>
            </div>
          </div>
          <figure>
            <img src="/9.webp" alt="José Carlos Hidalgo" loading="eager" />
          </figure>
        </section>

        <section className="profile-section" id="services">
          <div className="profile-section__intro">
            <span className="profile-page__eyebrow">Áreas de trabajo</span>
            <h2>Decisiones financieras con contexto patrimonial.</h2>
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

        <section className="profile-section">
          <div className="profile-section__intro">
            <span className="profile-page__eyebrow">Herramientas</span>
            <h2>Recursos prácticos para decidir mejor.</h2>
          </div>
          <div className="profile-grid profile-grid--compact">
            {tools.map(([label, href], index) => (
              <a className="profile-card profile-card--link" href={href} key={label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{label}</h3>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
