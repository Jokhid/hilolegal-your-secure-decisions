(() => {
  const BLOCKS = [
    {
      id: "A",
      name: "Escudo de protección",
      description: "Seguridad ante imprevistos vitales",
      tips: [
        "Crea un fondo de emergencia de 3 a 6 meses de gastos.",
        "Asegura un capital de vida que cubra deudas e hijos.",
        "Contrata un seguro de salud para evitar listas de espera.",
      ],
    },
    {
      id: "B",
      name: "Futuro y crecimiento",
      description: "Planificación a largo plazo e inflación",
      tips: [
        "Automatiza el ahorro mensual.",
        "Invierte para batir a la inflación con interés compuesto.",
        "Aprovecha las deducciones fiscales de planes de previsión.",
      ],
    },
    {
      id: "C",
      name: "Cimientos legales",
      description: "Seguridad jurídica y patrimonial",
      tips: [
        "Firma un testamento ante notario.",
        "Otorga poderes preventivos para casos de incapacidad.",
        "Designa tutores legales si tienes hijos menores.",
      ],
    },
    {
      id: "D",
      name: "Deuda",
      description: "Eficiencia en pasivos e hipotecas",
      tips: [
        "Elimina primero las deudas de tarjetas y consumo.",
        "Negocia tu hipoteca si el interés supera el mercado.",
        "No superes el 35% de ingresos en cuotas de deuda.",
      ],
    },
  ];

  const QUESTIONS = [
    { id: 1, block: "A", title: "Baja laboral", text: "Si mañana sufrieras una enfermedad o accidente que te impidiera trabajar durante 6 meses, ¿tienes un fondo de emergencia o un seguro que complemente lo que necesitas para vivir?", why: "La Seguridad Social rara vez cubre el 100% de tus ingresos reales.", risk: "Sin este complemento, puedes verte obligado a gastar tus ahorros o endeudarte para pagar vivienda, facturas y gastos mientras te recuperas." },
    { id: 2, block: "A", title: "Desgracia familiar", text: "En caso de fallecimiento repentino, ¿tu familia tendría más de 50.000 € disponibles de inmediato para afrontar impuestos, gastos vitales y adaptarse a la nueva situación?", why: "Al fallecer, las cuentas bancarias del titular pueden bloquearse hasta resolver la herencia.", risk: "Tu familia puede recibir bienes, pero carecer de liquidez inmediata justo en el peor momento emocional." },
    { id: 3, block: "A", title: "Acceso sanitario", text: "¿Tienes acceso directo a medicina privada y hospitalización sin pasar por listas de espera?", why: "En salud, el tiempo de diagnóstico puede cambiarlo todo.", risk: "Depender solo de listas de espera puede convertir un problema tratable en un riesgo mayor." },
    { id: 4, block: "B", title: "Jubilación", text: "¿Sabes cuál será tu pensión pública y tienes un plan para cubrir el resto?", why: "La pensión pública tiene límites y puede no sostener tu nivel de vida actual.", risk: "Si no calculas la diferencia a tiempo, llegarás a la jubilación con menos ingresos y poco margen de corrección." },
    { id: 5, block: "B", title: "Inflación", text: "El dinero que tienes ahorrado en el banco, ¿te está generando al menos un 2,5% de rentabilidad anual?", why: "La inflación reduce el valor real del dinero parado.", risk: "Tener ahorro inmóvil durante años puede hacerte perder poder adquisitivo sin darte cuenta." },
    { id: 6, block: "B", title: "Eficiencia fiscal", text: "¿Aprovechaste en tu última declaración de la Renta las reducciones por aportaciones a sistemas de previsión social?", why: "La planificación fiscal puede liberar recursos para ahorro e inversión.", risk: "No usar esos mecanismos puede suponer pagar más impuestos de los necesarios." },
    { id: 7, block: "C", title: "Testamento antibloqueo", text: "¿Tienes hecho testamento ante notario y revisado en los últimos 5 años?", why: "Un testamento actualizado evita conflictos y agiliza decisiones familiares.", risk: "Sin testamento, el proceso puede ser más caro, lento y emocionalmente difícil." },
    { id: 8, block: "C", title: "Poderes preventivos", text: "¿Has firmado un poder preventivo para que alguien gestione tu patrimonio si sufres una incapacidad sobrevenida?", why: "Una incapacidad puede bloquear tu capacidad de firma.", risk: "Sin poder preventivo, tu familia puede necesitar un procedimiento judicial para gestionar tu propio dinero." },
    { id: 9, block: "C", title: "Tutela de menores", text: "Si tenéis hijos menores, ¿habéis designado en testamento quién sería su tutor legal si ambos padres faltaseis?", why: "La designación evita dejar una decisión sensible en manos de terceros.", risk: "Tus hijos podrían quedar sujetos a decisiones que no coincidan con tus valores o preferencias." },
    { id: 10, block: "D", title: "Salud hipotecaria", text: "¿Has revisado tu hipoteca en los últimos 24 meses para mejorar tipos, diferencial o vinculaciones?", why: "La hipoteca suele ser el mayor gasto de una familia.", risk: "Una diferencia pequeña de tipo puede costar decenas de miles de euros durante la vida del préstamo.", options: [{ val: 0, label: "No" }, { val: 5, label: "No tengo hipoteca" }, { val: 10, label: "Sí / Totalmente" }] },
    { id: 11, block: "D", title: "Ratio de solvencia", text: "¿El total de tus préstamos e hipotecas supera el 35% de tus ingresos?", why: "Es una referencia básica de estrés financiero.", risk: "Superar ese límite reduce tu margen ante subidas de tipos o imprevistos.", options: [{ val: 0, label: "Sí, lo superan" }, { val: 5, label: "Están justo en el límite" }, { val: 10, label: "No, están por debajo" }] },
    { id: 12, block: "D", title: "Otras deudas", text: "¿Tienes otras deudas, como tarjetas o préstamos de consumo?", why: "La deuda de consumo puede destruir capacidad de ahorro.", risk: "Los intereses altos pueden devorar tu margen mensual.", options: [{ val: 10, label: "No" }, { val: 5, label: "Sí, poco relevantes" }, { val: 0, label: "Sí, relevantes" }] },
  ];

  const DEFAULT_OPTIONS = [
    { val: 0, label: "No" },
    { val: 5, label: "Parcialmente" },
    { val: 10, label: "Sí / Totalmente" },
  ];

  const state = { screen: "welcome", block: 0, answers: new Map() };

  function normalizeScore(score) {
    return Math.max(0, Math.min(10, score || 0));
  }

  function scoreColor(score) {
    if (score >= 8) return "#009e60";
    if (score >= 5) return "#c5a566";
    return "#ef4444";
  }

  function calculateBlockScore(blockId) {
    const blockQuestions = QUESTIONS.filter((q) => q.block === blockId);
    const validQuestions = blockQuestions.filter((q) => q.id !== 10 || state.answers.get(10) !== 5);
    if (!validQuestions.length) return 0;
    const total = validQuestions.reduce((sum, q) => sum + (state.answers.get(q.id) ?? 0), 0);
    return total / validQuestions.length;
  }

  function overallScore() {
    return BLOCKS.reduce((sum, block) => sum + calculateBlockScore(block.id), 0) / BLOCKS.length;
  }

  function progress() {
    return Math.round((state.answers.size / QUESTIONS.length) * 100);
  }

  function currentQuestions() {
    return QUESTIONS.filter((q) => q.block === BLOCKS[state.block].id);
  }

  function currentComplete() {
    return currentQuestions().every((q) => state.answers.has(q.id));
  }

  function resultText(score) {
    if (score < 5) return { title: "Tu patrimonio necesita cuidados urgentes", body: "El diagnóstico muestra fragilidad ante imprevistos legales o económicos. Hay margen de maniobra, pero conviene blindar cimientos antes de seguir construyendo." };
    if (score < 8) return { title: "Vas por buen camino, pero hay grietas invisibles", body: "Hay áreas bien encaminadas y otras que pueden estar frenando tu protección real. Con ajustes estratégicos puedes pasar de estar bien a estar mejor blindado." };
    return { title: "Excelente salud financiera", body: "Tu situación muestra una base sólida. El siguiente paso es revisar optimización, fiscalidad, protección legal y estrategia patrimonial para mantener y mejorar esa posición." };
  }

  function piggySvg(mood = "welcome", score) {
    const staticScore = typeof score === "number";
    const shownScore = staticScore ? normalizeScore(score) : 5;
    const liquidY = 160 - shownScore * 13.5;
    const liquidHeight = shownScore * 13.5 + 15;
    const liquidColor = scoreColor(shownScore);
    const face = staticScore ? (shownScore >= 9 ? "surprised" : shownScore >= 8 ? "happy" : shownScore < 5 ? "sad" : "neutral") : mood;

    return `<div class="financial-piggy" aria-hidden="true">
      <svg viewBox="0 0 400 240">
        <defs>
          <linearGradient id="hlCoin" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f8d57f"/><stop offset="55%" stop-color="#c5a566"/><stop offset="100%" stop-color="#8f6e34"/></linearGradient>
          <linearGradient id="hlGlass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#fff"/><stop offset="50%" stop-color="#f3f0ea"/><stop offset="100%" stop-color="#cfc9bd"/></linearGradient>
        </defs>
        <g transform="translate(40 20)">
          <ellipse cx="100" cy="175" rx="75" ry="10" fill="#000" opacity=".25"/>
          <g class="piggy-coin"><circle cx="100" cy="30" r="15" fill="url(#hlCoin)" stroke="#0a0a0a" stroke-width="3"/><text x="100" y="35" text-anchor="middle" fill="#0a0a0a" font-size="12" font-weight="900">€</text></g>
          <path class="${face === "happy" || face === "welcome" || face === "surprised" ? "piggy-tail" : ""}" d="M160 110Q180 90 170 80Q160 70 175 70" fill="none" stroke="#f2cfd2" stroke-width="6" stroke-linecap="round"/>
          <path d="M35 110Q35 50 100 50Q165 50 165 110Q165 155 100 155Q35 155 35 110" fill="#f2dadd" stroke="#0a0a0a" stroke-width="3.5"/>
          <path d="M60 60L45 35L85 55" fill="#f2dadd" stroke="#0a0a0a" stroke-width="2.5"/><path d="M140 60L155 35L115 55" fill="#f2dadd" stroke="#0a0a0a" stroke-width="2.5"/>
          <rect x="62" y="152" width="16" height="22" rx="5" fill="#f2dadd" stroke="#0a0a0a" stroke-width="2.5"/><rect x="122" y="152" width="16" height="22" rx="5" fill="#f2dadd" stroke="#0a0a0a" stroke-width="2.5"/>
          <ellipse cx="100" cy="115" rx="18" ry="14" fill="#eaaeb8" stroke="#0a0a0a" stroke-width="2.5"/><circle cx="94" cy="115" r="2.5"/><circle cx="106" cy="115" r="2.5"/>
          <g class="face face-happy ${face === "happy" ? "is-visible" : ""}"><path d="M72 95Q80 85 88 95M112 95Q120 85 128 95M85 138Q100 152 115 138" fill="none" stroke="#0a0a0a" stroke-width="3" stroke-linecap="round"/></g>
          <g class="face face-neutral ${face === "neutral" ? "is-visible" : ""}"><circle cx="80" cy="95" r="3.5"/><circle cx="120" cy="95" r="3.5"/><line x1="90" y1="135" x2="110" y2="135" stroke="#0a0a0a" stroke-width="3" stroke-linecap="round"/></g>
          <g class="face face-sad ${face === "sad" ? "is-visible" : ""}"><path d="M74 98Q80 92 86 98M114 98Q120 92 126 98M90 140Q100 132 110 140" fill="none" stroke="#0a0a0a" stroke-width="3" stroke-linecap="round"/><path class="piggy-sweat" d="M150 85Q150 95 145 95Q140 95 140 85Q140 75 145 75Q150 75 150 85" fill="#60a5fa"/></g>
          <g class="face ${face === "surprised" ? "is-visible" : ""}"><path d="M72 95Q80 85 88 95M112 95Q120 85 128 95" fill="none" stroke="#0a0a0a" stroke-width="4" stroke-linecap="round"/><path d="M82 135Q100 165 118 135Z" fill="#ef4444" stroke="#0a0a0a" stroke-width="2.5"/><path d="M85 55L100 10L115 55Z" fill="#c5a566" stroke="#0a0a0a" stroke-width="2.5"/></g>
        </g>
        <g transform="translate(300 25)">
          <path d="M8 15A12 12 0 0 1 32 15V158A22 22 0 1 1 8 158Z" fill="url(#hlGlass)" stroke="#0a0a0a" stroke-width="3"/>
          <circle cx="20" cy="180" r="17" fill="${staticScore ? liquidColor : "#ef4444"}" class="${staticScore ? "" : "thermo-flow"}"/>
          <rect x="14" y="${staticScore ? liquidY : 160}" width="12" height="${staticScore ? liquidHeight : 15}" rx="6" fill="${staticScore ? liquidColor : "#ef4444"}" class="${staticScore ? "" : "thermo-flow"}"/>
          <g font-size="9" font-weight="800" fill="#0a0a0a" opacity=".45" transform="translate(38 15)">${[10,8,6,4,2,0].map((v,i)=>`<g transform="translate(0 ${i*27})"><line x1="-8" x2="-2" stroke="#0a0a0a" stroke-width="1.5"/><text x="5" y="3.5">${v}</text></g>`).join("")}</g>
          <path d="M12 15A8 8 0 0 1 18 15V155" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55"/>
        </g>
      </svg>
    </div>`;
  }

  function gauge(block) {
    const score = normalizeScore(calculateBlockScore(block.id));
    const color = scoreColor(score);
    const degrees = Math.max(score, 2) * 18;
    const status = score >= 8 ? "Óptimo" : score >= 5 ? "Mejorable" : "Riesgo";
    return `<article class="financial-gauge"><div class="financial-gauge__label">${block.name}</div><div class="financial-gauge__arc" style="--score:${degrees}deg;--score-color:${color}"><strong style="color:${color}">${score.toFixed(1)}</strong></div><span style="background:${color}">${status}</span><ul>${block.tips.map((tip) => `<li>${tip}</li>`).join("")}</ul></article>`;
  }

  function render() {
    const root = document.getElementById("test-salud-financiera");
    if (!root) return;
    const pct = state.screen === "results" ? 100 : progress();
    root.innerHTML = `<div class="financial-tool__progress"><span>Estado del diagnóstico</span><b>${state.screen === "results" ? "Evaluación completada" : `${pct}% completado`}</b><i><em style="width:${pct}%"></em></i></div>${screenMarkup()}`;
    root.querySelectorAll("[data-action]").forEach((el) => el.addEventListener("click", handleAction));
    root.querySelectorAll("[data-answer]").forEach((el) => el.addEventListener("click", handleAnswer));
  }

  function screenMarkup() {
    if (state.screen === "welcome") {
      return `<div class="financial-tool__welcome"><div><span class="financial-tool__eyebrow">Herramienta 01</span><h3>Test de salud financiera</h3><p>Descubre en 12 preguntas la vulnerabilidad de tu familia ante imprevistos y cómo protegerla.</p><button data-action="start">Iniciar diagnóstico</button></div>${piggySvg("welcome")}</div>`;
    }
    if (state.screen === "quiz") {
      const block = BLOCKS[state.block];
      return `<div class="financial-tool__quiz"><div class="financial-tool__block"><span>Bloque ${state.block + 1} de ${BLOCKS.length}</span><h3>${block.name}</h3><p>${block.description}</p></div><div class="financial-tool__questions">${currentQuestions().map(questionMarkup).join("")}</div><div class="financial-tool__nav"><button data-action="prev">Anterior</button><button data-action="next" ${currentComplete() ? "" : "disabled"}>${state.block < BLOCKS.length - 1 ? "Siguiente bloque" : "Ver resultados"}</button></div></div>`;
    }
    const score = overallScore();
    const message = resultText(score);
    return `<div class="financial-tool__results"><div class="financial-tool__result-hero">${piggySvg("happy", score)}<div><span>Resultado global</span><strong style="color:${scoreColor(score)}">${score.toFixed(1)}<small>/10</small></strong><h3>${message.title}</h3><p>${message.body}</p></div></div><div class="financial-tool__gauges">${BLOCKS.map(gauge).join("")}</div><div class="financial-tool__nav"><button data-action="edit">Editar respuestas</button><button data-action="restart">Repetir evaluación</button><a href="https://calendly.com/jchidalgo/plan" target="_blank" rel="noopener noreferrer">Agendar reunión</a></div></div>`;
  }

  function questionMarkup(q) {
    const options = q.options || DEFAULT_OPTIONS;
    const selected = state.answers.get(q.id);
    const number = String(QUESTIONS.findIndex((item) => item.id === q.id) + 1).padStart(2, "0");
    return `<article class="financial-question ${selected !== undefined ? "is-answered" : ""}"><h4><span>${number}.</span>${q.title}</h4><p>${q.text}</p><div class="financial-question__options">${options.map((option) => `<button data-answer="${q.id}:${option.val}" class="${selected === option.val ? "is-selected" : ""}">${option.label}</button>`).join("")}</div>${selected !== undefined ? `<div class="financial-question__insight"><div><b>Por qué importa</b><p>${q.why}</p></div><div><b>Riesgo latente</b><p>${q.risk}</p></div></div>` : ""}</article>`;
  }

  function handleAction(event) {
    const action = event.currentTarget.dataset.action;
    if (action === "start") { state.screen = "quiz"; state.block = 0; state.answers.clear(); }
    if (action === "prev") { state.block > 0 ? state.block -= 1 : state.screen = "welcome"; }
    if (action === "next") { state.block < BLOCKS.length - 1 ? state.block += 1 : state.screen = "results"; }
    if (action === "edit") { state.screen = "quiz"; state.block = BLOCKS.length - 1; }
    if (action === "restart") { state.screen = "welcome"; state.block = 0; state.answers.clear(); }
    render();
    document.getElementById("test-salud-financiera")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleAnswer(event) {
    const [id, value] = event.currentTarget.dataset.answer.split(":").map(Number);
    state.answers.set(id, value);
    render();
  }

  function mount() {
    const toolsInner = document.querySelector("#herramientas .tools__inner");
    if (!toolsInner || document.getElementById("test-salud-financiera")) return;
    const host = document.createElement("div");
    host.id = "test-salud-financiera";
    host.className = "financial-tool";
    toolsInner.appendChild(host);
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
  window.setTimeout(mount, 400);
  window.setTimeout(mount, 1200);
})();
