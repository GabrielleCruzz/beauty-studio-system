(() => {
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const profissionais = ["Val", "Anny"];
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const seletorTipo = document.getElementById("tipo-periodo");
    const seletorDia = document.getElementById("periodo-dia");
    const seletorSemana = document.getElementById("periodo-semana");
    const seletorMes = document.getElementById("periodo-mes");
    const erroDados = document.getElementById("aviso-dados");
    const formatarMoeda = valor => valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    const dataIso = data => [
        data.getFullYear(),
        String(data.getMonth() + 1).padStart(2, "0"),
        String(data.getDate()).padStart(2, "0")
    ].join("-");

    function semanaIso(data) {
        const copia = new Date(Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()));
        copia.setUTCDate(copia.getUTCDate() + 4 - (copia.getUTCDay() || 7));
        const inicioAno = new Date(Date.UTC(copia.getUTCFullYear(), 0, 1));
        const numeroSemana = Math.ceil(((copia - inicioAno) / 86400000 + 1) / 7);
        return `${copia.getUTCFullYear()}-W${String(numeroSemana).padStart(2, "0")}`;
    }

    function formatoIsoUtc(data) {
        return [
            data.getUTCFullYear(),
            String(data.getUTCMonth() + 1).padStart(2, "0"),
            String(data.getUTCDate()).padStart(2, "0")
        ].join("-");
    }

    function criarDadosDemonstrativos() {
        const registros = [];
        for (let ano = anoAtual - 5; ano <= anoAtual; ano += 1) {
            for (let mes = 0; mes < 12; mes += 1) {
                const diasNoMes = new Date(ano, mes + 1, 0).getDate();
                for (let dia = 1; dia <= diasNoMes; dia += 1) {
                    const data = dataIso(new Date(ano, mes, dia));
                    const quantidadeVal = 1 + ((dia + mes) % 2);
                    const quantidadeAnny = 1 + ((dia * 2 + mes) % 2);
                    [
                        { nome: "Val", quantidade: quantidadeVal, base: 115 + mes * 4 },
                        { nome: "Anny", quantidade: quantidadeAnny, base: 125 + mes * 3 }
                    ].forEach(({ nome, quantidade, base }) => {
                        for (let indice = 0; indice < quantidade; indice += 1) {
                            const valor = base + ((dia * 7 + indice * 13 + ano) % 55);
                            registros.push({
                                id: `demo-${ano}-${mes + 1}-${dia}-${nome}-${indice}`,
                                data,
                                status: "concluido",
                                valor,
                                procedimentos: [{ profissional: nome, valor }]
                            });
                        }
                    });
                }
            }
        }
        return registros;
    }

    function obterPeriodoSelecionado() {
        if (seletorTipo.value === "dia") {
            return { inicio: seletorDia.value, fim: seletorDia.value };
        }

        if (seletorTipo.value === "semana") {
            if (!seletorSemana.value) return { inicio: "", fim: "" };
            const [ano, semana] = seletorSemana.value.split("-W").map(Number);
            const quarta = new Date(Date.UTC(ano, 0, 4 + (semana - 1) * 7));
            const diaDaSemana = quarta.getUTCDay() || 7;
            const segunda = new Date(quarta);
            segunda.setUTCDate(quarta.getUTCDate() - diaDaSemana + 1);
            const domingo = new Date(segunda);
            domingo.setUTCDate(segunda.getUTCDate() + 6);
            return { inicio: formatoIsoUtc(segunda), fim: formatoIsoUtc(domingo) };
        }

        if (!seletorMes.value) return { inicio: "", fim: "" };
        const [ano, mes] = seletorMes.value.split("-").map(Number);
        return {
            inicio: `${ano}-${String(mes).padStart(2, "0")}-01`,
            fim: dataIso(new Date(ano, mes, 0))
        };
    }

    function obterPeriodoSemana(data) {
        const inicio = new Date(data.getFullYear(), data.getMonth(), data.getDate());
        const diaDaSemana = (inicio.getDay() + 6) % 7;
        inicio.setDate(inicio.getDate() - diaDaSemana);
        const fim = new Date(inicio);
        fim.setDate(fim.getDate() + 6);
        return { inicio: dataIso(inicio), fim: dataIso(fim) };
    }

    function rotuloPeriodo() {
        if (seletorTipo.value === "dia") {
            return seletorDia.value
                ? new Date(`${seletorDia.value}T12:00:00`).toLocaleDateString("pt-BR")
                : "Selecione uma data";
        }
        if (seletorTipo.value === "semana") {
            if (!seletorSemana.value) return "Selecione uma semana";
            const [ano, semana] = seletorSemana.value.split("-W");
            return `Semana ${semana} de ${ano}`;
        }
        return seletorMes.value
            ? new Date(`${seletorMes.value}-02T12:00:00`).toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric"
            })
            : "Selecione um mês";
    }

    seletorDia.value = dataIso(hoje);
    seletorSemana.value = semanaIso(hoje);
    seletorMes.value = dataIso(hoje).slice(0, 7);

    const registrosGraficosDemo = criarDadosDemonstrativos();
    let registros;
    try {
        const registrosSalvos = window.beautyStudioReports.lerAgendamentos();
        registros = registrosSalvos === null ? registrosGraficosDemo : registrosSalvos;
    } catch (erro) {
        registros = registrosGraficosDemo;
        erroDados.textContent = erro instanceof Error
            ? erro.message
            : "Não foi possível ler os atendimentos salvos neste navegador.";
        erroDados.hidden = false;
    }

    const seletoresAno = [
        document.getElementById("ano-faturamento"),
        document.getElementById("ano-atendimentos")
    ];
    const anos = Array.from({ length: 6 }, (_, index) => anoAtual - index);
    seletoresAno.forEach(seletor => {
        anos.forEach(ano => {
            const opcao = document.createElement("option");
            opcao.value = String(ano);
            opcao.textContent = String(ano);
            seletor.appendChild(opcao);
        });
    });

    function resumirPeriodo(inicio, fim) {
        return window.beautyStudioReports.resumir(registros, inicio, fim);
    }

    function criarCelulaProfissional(nome) {
        const celula = document.createElement("td");
        const avatar = document.createElement("span");
        avatar.className = "avatar-profissional";
        avatar.textContent = nome.charAt(0);
        celula.className = "profissional";
        celula.append(avatar, document.createTextNode(nome));
        return celula;
    }

    function atualizarIndicadoresETabelas() {
        const periodo = obterPeriodoSelecionado();
        const resumo = periodo.inicio && periodo.fim
            ? resumirPeriodo(periodo.inicio, periodo.fim)
            : Object.fromEntries(profissionais.map(nome => [
                nome,
                { atendimentos: 0, faturamento: 0 }
            ]));
        const totalFaturamento = profissionais.reduce(
            (total, nome) => total + resumo[nome].faturamento,
            0
        );
        const totalAtendimentos = periodo.inicio && periodo.fim
            ? window.beautyStudioReports.totalAtendimentos(registros, periodo.inicio, periodo.fim)
            : 0;
        const rotulo = rotuloPeriodo();

        document.getElementById("total-faturamento").textContent = formatarMoeda(totalFaturamento);
        document.getElementById("total-atendimentos").textContent = String(totalAtendimentos);
        document.getElementById("rotulo-faturamento").textContent = rotulo;
        document.getElementById("rotulo-atendimentos").textContent = rotulo;

        const periodoHoje = dataIso(hoje);
        const periodoMesAtual = {
            inicio: `${anoAtual}-${String(hoje.getMonth() + 1).padStart(2, "0")}-01`,
            fim: dataIso(new Date(anoAtual, hoje.getMonth() + 1, 0))
        };
        const periodoSemanaAtual = obterPeriodoSemana(hoje);
        const faturamentoHoje = resumirPeriodo(periodoHoje, periodoHoje);
        const faturamentoSemana = resumirPeriodo(periodoSemanaAtual.inicio, periodoSemanaAtual.fim);
        const faturamentoMes = resumirPeriodo(periodoMesAtual.inicio, periodoMesAtual.fim);
        document.getElementById("mes-atual").textContent =
            `FATURAMENTO DE ${hoje.toLocaleDateString("pt-BR", { month: "long" }).toUpperCase()}`;
        document.getElementById("faturamento-dia").textContent =
            formatarMoeda(profissionais.reduce((total, nome) => total + faturamentoHoje[nome].faturamento, 0));
        document.getElementById("faturamento-semana").textContent =
            formatarMoeda(profissionais.reduce((total, nome) => total + faturamentoSemana[nome].faturamento, 0));
        document.getElementById("faturamento-mes").textContent =
            formatarMoeda(profissionais.reduce((total, nome) => total + faturamentoMes[nome].faturamento, 0));

        document.getElementById("cabecalho-faturamento").textContent =
            seletorTipo.value === "dia" ? "Faturamento no dia"
                : seletorTipo.value === "semana" ? "Faturamento na semana"
                    : "Faturamento no mês";
        document.getElementById("cabecalho-atendimentos").textContent =
            seletorTipo.value === "dia" ? "Atendimentos no dia"
                : seletorTipo.value === "semana" ? "Atendimentos na semana"
                    : "Atendimentos no mês";

        const faturamentoTabela = document.getElementById("tabela-faturamento");
        const atendimentosTabela = document.getElementById("tabela-atendimentos");
        faturamentoTabela.replaceChildren();
        atendimentosTabela.replaceChildren();
        profissionais.forEach(nome => {
            const linhaFaturamento = document.createElement("tr");
            linhaFaturamento.append(
                criarCelulaProfissional(nome),
                Object.assign(document.createElement("td"), {
                    className: "valor-coluna",
                    textContent: formatarMoeda(resumo[nome].faturamento)
                })
            );
            faturamentoTabela.appendChild(linhaFaturamento);

            const linhaAtendimentos = document.createElement("tr");
            linhaAtendimentos.append(
                criarCelulaProfissional(nome),
                Object.assign(document.createElement("td"), {
                    className: "valor-coluna",
                    textContent: String(resumo[nome].atendimentos)
                })
            );
            atendimentosTabela.appendChild(linhaAtendimentos);
        });
    }

    function dadosMensais(ano, tipo) {
        return Array.from({ length: 12 }, (_, mes) => {
            const inicio = `${ano}-${String(mes + 1).padStart(2, "0")}-01`;
            const fim = dataIso(new Date(ano, mes + 1, 0));
            if (tipo === "atendimentos") {
                return window.beautyStudioReports.totalAtendimentos(
                    registrosGraficosDemo,
                    inicio,
                    fim
                );
            }

            const resumo = window.beautyStudioReports.resumir(
                registrosGraficosDemo,
                inicio,
                fim
            );
            return profissionais.reduce(
                (total, nome) => total + resumo[nome].faturamento,
                0
            );
        });
    }

    const opcoesComuns = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: "index" },
        plugins: {
            legend: { display: false },
            tooltip: { displayColors: false }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    color: "#8a82a0",
                    font: { size: window.matchMedia("(max-width: 560px)").matches ? 9 : 11 },
                    maxRotation: 0,
                    autoSkip: false
                }
            },
            y: {
                beginAtZero: true,
                grid: { color: "#f0edf4" },
                ticks: { color: "#8a82a0", precision: 0 }
            }
        }
    };

    const graficoFinanceiro = new Chart(document.getElementById("graficoFinanceiro"), {
        type: "bar",
        data: {
            labels: meses,
            datasets: [{
                label: "Faturamento",
                data: dadosMensais(anoAtual, "faturamento"),
                backgroundColor: "#c8a9eb",
                hoverBackgroundColor: "#7A4FC4",
                borderRadius: 6,
                maxBarThickness: 26,
                categoryPercentage: 0.72,
                barPercentage: 0.82
            }]
        },
        options: {
            ...opcoesComuns,
            plugins: {
                ...opcoesComuns.plugins,
                tooltip: {
                    ...opcoesComuns.plugins.tooltip,
                    callbacks: { label: contexto => formatarMoeda(contexto.raw) }
                }
            },
            scales: {
                ...opcoesComuns.scales,
                y: {
                    ...opcoesComuns.scales.y,
                    ticks: {
                        ...opcoesComuns.scales.y.ticks,
                        callback: valor => `R$ ${Number(valor).toLocaleString("pt-BR")}`
                    }
                }
            }
        }
    });

    const graficoAtendimentos = new Chart(document.getElementById("graficoAtendimentos"), {
        type: "line",
        data: {
            labels: meses,
            datasets: [{
                label: "Atendimentos",
                data: dadosMensais(anoAtual, "atendimentos"),
                borderColor: "#9b6bd3",
                backgroundColor: "rgba(205, 151, 241, 0.16)",
                tension: 0.32,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: "#9b6bd3"
            }]
        },
        options: {
            ...opcoesComuns,
            plugins: {
                ...opcoesComuns.plugins,
                tooltip: {
                    ...opcoesComuns.plugins.tooltip,
                    callbacks: { label: contexto => `${contexto.raw} atendimentos` }
                }
            }
        }
    });

    seletoresAno[0].addEventListener("change", evento => {
        graficoFinanceiro.data.datasets[0].data =
            dadosMensais(Number(evento.target.value), "faturamento");
        graficoFinanceiro.update();
    });
    seletoresAno[1].addEventListener("change", evento => {
        graficoAtendimentos.data.datasets[0].data =
            dadosMensais(Number(evento.target.value), "atendimentos");
        graficoAtendimentos.update();
    });

    function atualizarCamposPeriodo() {
        const tipo = seletorTipo.value;
        document.querySelectorAll(".periodo-campo").forEach(campo => {
            campo.hidden = !campo.id.endsWith(tipo);
        });
        atualizarIndicadoresETabelas();
    }

    seletorTipo.addEventListener("change", atualizarCamposPeriodo);
    [seletorDia, seletorSemana, seletorMes].forEach(seletor => {
        seletor.addEventListener("change", atualizarIndicadoresETabelas);
    });

    atualizarCamposPeriodo();
})();
