const appData = {
  categorias: [
    { id: "cafe", nombre: "Café y bebidas calientes", icono: "☕", precio: 1.5, descripcion: "Café diario en el trabajo o de camino a casa" },
    { id: "snacks", nombre: "Snacks y comida rápida", icono: "🍿", precio: 1.25, descripcion: "Patatas, chocolates, bollería y aperitivos" },
    { id: "cervezas", nombre: "Cervezas y bebidas alcohólicas", icono: "🍺", precio: 2.5, descripcion: "Cerveza en bares, vinos y cócteles" },
    { id: "refrescos", nombre: "Refrescos y bebidas frías", icono: "🥤", precio: 1.5, descripcion: "Refrescos, zumos y agua embotellada" },
    { id: "restaurantes", nombre: "Comida en restaurantes", icono: "🍽️", precio: 12, descripcion: "Almuerzos y cenas fuera de casa no planificadas" },
    { id: "compras", nombre: "Compras impulsivas", icono: "🛍️", precio: 5, descripcion: "Artículos no planificados en supermercados y tiendas" },
    { id: "suscripciones", nombre: "Suscripciones innecesarias", icono: "📱", precio: 9.99, descripcion: "Apps y servicios que apenas utilizas" },
    { id: "transporte", nombre: "Transporte por comodidad", icono: "🚗", precio: 3, descripcion: "Taxis, VTC o patinetes cuando hay alternativas" },
    { id: "comisiones", nombre: "Comisiones bancarias evitables", icono: "🏦", precio: 2, descripcion: "Cajeros ajenos, pagos fuera de plazo o cargos evitables" },
    { id: "otros", nombre: "Otros gastos", icono: "💸", precio: 2.5, descripcion: "Cualquier gasto pequeño que se repite" },
  ],
  frecuencias: [
    { id: "diario", nombre: "Diario", multiplicador: 365 },
    { id: "semanal", nombre: "Semanal", multiplicador: 52 },
    { id: "mensual", nombre: "Mensual", multiplicador: 12 },
  ],
  consejos: [
    "Lleva café de casa en un termo reutilizable.",
    "Prepara snacks saludables antes de salir.",
    "Cancela suscripciones que no uses cada mes.",
    "Camina o usa transporte público en trayectos cortos.",
    "Haz una lista antes de comprar y respétala.",
    "Revisa comisiones y condiciones bancarias.",
    "Separa una cantidad mensual para caprichos y no la superes.",
  ],
};

const gastos = {};
const charts = { distribucion: null, tiempo: null };
const chartColors = ["#C5A566", "#1A1A1A", "#737373", "#A3A3A3", "#D4C29D", "#57534E", "#0F766E", "#B45309", "#7F1D1D", "#3F3F46"];

function formatCurrency(amount) {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const hasDecimals = Math.round(safeAmount * 100) % 100 !== 0;
  const formatted = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(safeAmount);

  return `${formatted} €`;
}

function initializeState() {
  appData.categorias.forEach((categoria) => {
    gastos[categoria.id] = { activo: false, monto: categoria.precio, frecuencia: "diario" };
  });
}

function gastoAnual(categoriaId) {
  const gasto = gastos[categoriaId];
  if (!gasto || !gasto.activo || !gasto.monto) return 0;
  const frecuencia = appData.frecuencias.find((item) => item.id === gasto.frecuencia);
  return gasto.monto * (frecuencia?.multiplicador || 0);
}

function totales() {
  const anual = Object.keys(gastos).reduce((sum, id) => sum + gastoAnual(id), 0);
  return { diario: anual / 365, semanal: anual / 52, mensual: anual / 12, anual };
}

function renderGastos() {
  const grid = document.getElementById("gastosGrid");
  grid.innerHTML = "";

  appData.categorias.forEach((categoria) => {
    const gasto = gastos[categoria.id];
    const card = document.createElement("article");
    card.className = `gasto-card ${gasto.activo ? "active" : ""}`;
    card.innerHTML = `
      <div class="gasto-header">
        <div class="gasto-info">
          <span class="gasto-icon">${categoria.icono}</span>
          <div class="gasto-details">
            <h5>${categoria.nombre}</h5>
            <p>${categoria.descripcion}</p>
          </div>
        </div>
        <button class="gasto-toggle ${gasto.activo ? "active" : ""}" type="button" role="switch" aria-checked="${gasto.activo}" aria-label="Activar ${categoria.nombre}" data-categoria="${categoria.id}"></button>
      </div>
      <div class="gasto-controls">
        <input type="number" value="${gasto.monto}" step="0.01" min="0" data-categoria="${categoria.id}" data-type="monto" ${!gasto.activo ? "disabled" : ""} aria-label="Importe" />
        <select data-categoria="${categoria.id}" data-type="frecuencia" ${!gasto.activo ? "disabled" : ""} aria-label="Frecuencia">
          ${appData.frecuencias.map((frecuencia) => `<option value="${frecuencia.id}" ${gasto.frecuencia === frecuencia.id ? "selected" : ""}>${frecuencia.nombre}</option>`).join("")}
        </select>
      </div>
      <div class="gasto-annual"><span id="anual-${categoria.id}">${formatCurrency(gastoAnual(categoria.id))}</span> / año</div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll(".gasto-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const id = toggle.getAttribute("data-categoria");
      gastos[id].activo = !gastos[id].activo;
      renderGastos();
      updateAll();
    });
  });

  grid.querySelectorAll("input[data-type='monto']").forEach((input) => {
    input.addEventListener("input", () => {
      const id = input.getAttribute("data-categoria");
      gastos[id].monto = Math.max(0, parseFloat(input.value) || 0);
      updateAll();
      const anual = document.getElementById(`anual-${id}`);
      if (anual) anual.textContent = formatCurrency(gastoAnual(id));
    });
  });

  grid.querySelectorAll("select[data-type='frecuencia']").forEach((select) => {
    select.addEventListener("change", () => {
      const id = select.getAttribute("data-categoria");
      gastos[id].frecuencia = select.value;
      updateAll();
      const anual = document.getElementById(`anual-${id}`);
      if (anual) anual.textContent = formatCurrency(gastoAnual(id));
    });
  });
}

function updateAll() {
  const total = totales();
  const pairs = {
    totalAnual: total.anual,
    ahorroAnual: total.anual,
    gastoDiario: total.diario,
    gastoSemanal: total.semanal,
    gastoMensual: total.mensual,
    gastoAnualCard: total.anual,
    ahorro50: total.anual * 0.5,
    ahorro75: total.anual * 0.75,
    ahorro100: total.anual,
    tuGastoMensual: total.mensual,
  };

  Object.entries(pairs).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = formatCurrency(value);
  });

  updateNivel(total.mensual);
  updateComparativa(total.mensual);
  renderConsejos();
  updateCharts();
}

function updateNivel(mensual) {
  const fill = document.getElementById("nivelFill");
  const text = document.getElementById("nivelText");
  const percentage = Math.min((mensual / 300) * 100, 100);
  fill.style.width = `${percentage}%`;

  if (mensual === 0) text.textContent = "Activa tus gastos recurrentes para ver el resultado.";
  else if (mensual < 50) text.textContent = "Bajo: buen control de pequeños gastos.";
  else if (mensual < 150) text.textContent = "Medio: hay margen para recuperar ahorro.";
  else text.textContent = "Alto: conviene revisar hábitos y prioridades.";
}

function updateComparativa(mensual) {
  const result = document.getElementById("comparativaResultado");
  const diff = mensual - 150;
  result.className = "comparativa-resultado";

  if (mensual === 0) {
    result.textContent = "Activa alguna categoría para comparar.";
  } else if (diff > 0) {
    result.classList.add("peor");
    result.innerHTML = `Gastas ${formatCurrency(diff)} más que la referencia mensual.<br><small>${Math.abs((diff / 150) * 100).toFixed(1)}% por encima</small>`;
  } else if (diff < 0) {
    result.classList.add("mejor");
    result.innerHTML = `Gastas ${formatCurrency(Math.abs(diff))} menos que la referencia mensual.<br><small>${Math.abs((diff / 150) * 100).toFixed(1)}% por debajo</small>`;
  } else {
    result.textContent = "Estás justo en la referencia mensual.";
  }
}

function renderConsejos() {
  const list = document.getElementById("consejosList");
  list.innerHTML = "";
  const active = Object.keys(gastos).filter((id) => gastos[id].activo);
  const consejos = active.length ? appData.consejos.slice(0, 4) : appData.consejos.slice(0, 4);
  consejos.forEach((consejo) => {
    const item = document.createElement("div");
    item.className = "consejo-item";
    item.textContent = consejo;
    list.appendChild(item);
  });
}

function initCharts() {
  if (!window.Chart) return;
  const distribucionCanvas = document.getElementById("chartDistribucion");
  const tiempoCanvas = document.getElementById("chartTiempo");

  charts.distribucion = new Chart(distribucionCanvas.getContext("2d"), {
    type: "doughnut",
    data: { labels: ["Sin gastos activos"], datasets: [{ data: [1], backgroundColor: ["#E5E5E5"], borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } }, cutout: "64%" },
  });

  charts.tiempo = new Chart(tiempoCanvas.getContext("2d"), {
    type: "bar",
    data: { labels: ["Diario", "Semanal", "Mensual", "Anual"], datasets: [{ data: [0, 0, 0, 0], backgroundColor: "#C5A566", borderRadius: 4 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { callback: (value) => formatCurrency(value) } } } },
  });

  updateCharts();
}

function updateCharts() {
  if (!charts.distribucion || !charts.tiempo) return;
  const active = appData.categorias.filter((categoria) => gastos[categoria.id].activo && gastos[categoria.id].monto > 0);
  const total = totales();

  charts.distribucion.data.labels = active.length ? active.map((categoria) => `${categoria.icono} ${categoria.nombre}`) : ["Sin gastos activos"];
  charts.distribucion.data.datasets[0].data = active.length ? active.map((categoria) => gastoAnual(categoria.id)) : [1];
  charts.distribucion.data.datasets[0].backgroundColor = active.length ? chartColors : ["#E5E5E5"];
  charts.distribucion.update();

  charts.tiempo.data.datasets[0].data = [total.diario, total.semanal, total.mensual, total.anual];
  charts.tiempo.update();
}

document.addEventListener("DOMContentLoaded", () => {
  initializeState();
  renderGastos();
  renderConsejos();
  updateAll();
  window.setTimeout(initCharts, 150);
});
