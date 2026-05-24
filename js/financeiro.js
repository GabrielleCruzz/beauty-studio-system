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


// Gráfico de rendimento mensal

const ctx = document.getElementById("graficoFinanceiro");

new Chart(ctx, {
    type: "bar",

    data: {
        labels: [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun"
        ],

        datasets: [{
            label: "Faturamento",

            data: [
                3200,
                4100,
                2800,
                5200,
                8750,
                4300
            ],

            backgroundColor: "#cca3f6",
            borderRadius: 10
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            },

            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `R$ ${context.raw}`;
                    }
                }
            }
        }
    }
});


// Gráfico total de atendimento

const ctxAtendimentos =
    document.getElementById("graficoAtendimentos");

new Chart(ctxAtendimentos, {
    type: "line",

    data: {
        labels: [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun"
        ],

        datasets: [{
            label: "Atendimentos",

            data: [
                45,
                62,
                39,
                80,
                120,
                74
            ],

            borderColor: "#d79bfd",
            backgroundColor: "rgba(205, 151, 241, 0.2)",
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 8
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            },

            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.raw} atendimentos`;
                    }
                }
            }
        }
    }
});