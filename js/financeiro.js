// Coloca o mês atual no card de faturamento mensal
const meses = [
    "JANEIRO",
    "FEVEREIRO",
    "MARÇO",
    "ABRIL",
    "MAIO",
    "JUNHO",
    "JULHO",
    "AGOSTO",
    "SETEMBRO",
    "OUTUBRO",
    "NOVEMBRO",
    "DEZEMBRO"
];

const data = new Date();
const mesAtual = meses[data.getMonth()];

document.getElementById("mes-atual").textContent = `FATURAMENTO DE ${mesAtual}`;