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