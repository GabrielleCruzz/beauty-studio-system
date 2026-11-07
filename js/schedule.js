(() => {

    // Atualizar status

    const agendamentos = document.querySelectorAll(".linha-cliente");
    let agendamentoAtual = null;
    const overlayCobranca = document.querySelector(".overlay-cobranca");
    const fecharCobranca = document.getElementById("fechar-cobranca");
    const confirmarPagamento = document.getElementById("confirmarPagamento");
    const valorPagamento = document.getElementById("valorPagamento");
    const erroPagamento = document.getElementById("erroPagamento");
    const formaPagamento = document.getElementById("formaPagamento");
    const campoParcelas = document.getElementById("campoParcelas");
    const parcelasPagamento = document.getElementById("parcelasPagamento");
    const valorParcela = document.getElementById("valorParcela");
    const resumoValor = document.getElementById("resumo-valor");

    function lerValor(texto) {
        const valorLimpo = texto.trim().replace(/[^\d,.-]/g, "");
        const valorNormalizado = valorLimpo.includes(",")
            ? valorLimpo.replace(/\./g, "").replace(",", ".")
            : valorLimpo;
        const valor = Number(valorNormalizado);
        return Number.isFinite(valor) ? valor : 0;
    }

    function formatarMoeda(valor) {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function atualizarResumoValor() {
        const valor = lerValor(valorPagamento.value);
        resumoValor.textContent = valor > 0 ? formatarMoeda(valor) : "Informe o valor";

        const parcelas = Number(parcelasPagamento.value);
        valorParcela.textContent = valor > 0 && parcelas > 1
            ? `${parcelas}x de ${formatarMoeda(valor / parcelas)}`
            : "";
    }

    function preencherResumoCobranca(agendamento) {
        const procedimentos = agendamento.querySelector(".procedimento").textContent
            .split("•")
            .map(procedimento => procedimento.trim())
            .filter(Boolean);
        const profissionalEl = agendamento.querySelector(".profissional");
        const profissional = Array.from(profissionalEl.childNodes)
            .filter(no => no.nodeType === Node.TEXT_NODE)
            .map(no => no.textContent)
            .join("")
            .trim();
        const valorSalvo = agendamento.dataset.valor || "";

        document.getElementById("resumo-cliente").textContent =
            agendamento.querySelector(".cliente").textContent.trim();
        const listaResumoProcedimentos = document.getElementById("resumo-procedimentos");
        const quantidadeProcedimentos = document.getElementById("quantidade-procedimentos");
        listaResumoProcedimentos.replaceChildren();
        quantidadeProcedimentos.textContent =
            `${procedimentos.length} ${procedimentos.length === 1 ? "item" : "itens"}`;
        (procedimentos.length ? procedimentos : ["Nenhum procedimento informado"])
            .forEach(procedimento => {
                const item = document.createElement("li");
                item.textContent = `• ${procedimento}`;
                listaResumoProcedimentos.appendChild(item);
            });
        document.getElementById("resumo-profissional").textContent = profissional || "Não informado";
        valorPagamento.value = valorSalvo;
        formaPagamento.value = "pix";
        parcelasPagamento.value = "1";
        campoParcelas.hidden = true;
        atualizarResumoValor();
    }

    agendamentos.forEach((agendamento) => {
        const status = agendamento.dataset.status;
        agendamento.classList.add(status);
        const botao = agendamento.querySelector(".btn-status");
        atualizarStatus(agendamento, botao);
    });

    const agenda = document.querySelector(".agenda");
    agenda.addEventListener("click", evento => {
        const botaoStatus = evento.target.closest(".btn-status");
        if (botaoStatus) {
            const agendamento = botaoStatus.closest(".linha-cliente");
            const statusAtual = agendamento.dataset.status;

            if (statusAtual === "naoiniciado") {
                agendamento.dataset.status = "emandamento";
                atualizarStatus(agendamento, botaoStatus);
            } else if (statusAtual === "emandamento") {
                agendamentoAtual = agendamento;
                preencherResumoCobranca(agendamento);
                overlayCobranca.classList.add("abrir");
            }
            return;
        }

        const botaoEditar = evento.target.closest(".btn-editar");
        if (botaoEditar) {
            agendamentoEmEdicao = botaoEditar.closest(".linha-cliente");
            preencherModal(agendamentoEmEdicao);
            abrirModal(overlayEdtAgendamento);
        }
    });

    fecharCobranca.addEventListener("click", () => {
        overlayCobranca.classList.remove("abrir");
        agendamentoAtual = null;
    });

    formaPagamento.addEventListener("change", () => {
        campoParcelas.hidden = formaPagamento.value !== "credito";
        atualizarResumoValor();
    });

    valorPagamento.addEventListener("input", atualizarResumoValor);
    parcelasPagamento.addEventListener("change", atualizarResumoValor);

    confirmarPagamento.addEventListener("click", () => {

        if (!agendamentoAtual) return;
        const valor = lerValor(valorPagamento.value);

        if (valor <= 0) {
            erroPagamento.classList.add("mostrar");
            setTimeout(() => {
                erroPagamento.classList.remove("mostrar");
            }, 3000);
            return;
        }

        agendamentoAtual.dataset.valor = formatarMoeda(valor);
        agendamentoAtual.dataset.formaPagamento = formaPagamento.value;
        agendamentoAtual.dataset.parcelas =
            formaPagamento.value === "credito" ? parcelasPagamento.value : "";
        agendamentoAtual.dataset.status = "concluido";
        const botao = agendamentoAtual.querySelector(".btn-status");
        atualizarStatus(agendamentoAtual, botao);
        overlayCobranca.classList.remove("abrir");
        valorPagamento.value = "";
        agendamentoAtual = null;

    });

    function atualizarStatus(agendamento, botao) {
        const status = agendamento.dataset.status;
        agendamento.classList.remove(
            "naoiniciado",
            "emandamento",
            "concluido"
        );

        agendamento.classList.add(status);
        botao.disabled = false;

        switch (status) {

            case "naoiniciado":
                botao.innerText = "Iniciar procedimento";
                break;

            case "emandamento":
                botao.innerText = "Abrir cobrança";
                break;

            case "concluido":
                botao.innerText = "Concluído";
                break;
        }
    }

    // Funções dos modais

    function abrirModal(overlay) {
        overlay.classList.add("abrir");
        document.body.style.overflow = "hidden";

    }

    function fecharModal(overlay) {
        overlay.classList.remove("abrir");
        document.body.style.overflow = "auto";

    }

    // Modal de detalhes e edição do atendimento

    const overlayEdtAgendamento = document.getElementById("overlay-edt-agendamento");
    const formEdtAgendamento = document.querySelector(".edt-form-agendamento");
    const listaProcedimentosEdt = document.getElementById("edt-lista-procedimentos");
    const totalEdtAgendamento = document.getElementById("edt-valor");
    const adicionarProcedimentoEdt = document.getElementById("edt-adicionar-procedimento");
    const botaoExcluirAtendimento = document.querySelector(".btn-excluir-atendimento");
    const botaoCancelarEdt = formEdtAgendamento.querySelector(".cancelarEdt");
    const botaoSalvarEdt = formEdtAgendamento.querySelector(".salvar");
    const camposEdtAgendamento = formEdtAgendamento.querySelector(".edt-campos");
    const relatorioAtendimento = formEdtAgendamento.querySelector(".relatorio-atendimento");
    const acoesEdtAgendamento = formEdtAgendamento.querySelector(".acoes-edt");
    let agendamentoEmEdicao = null;
    let idCampoProcedimentoEdt = 0;

    function dataLocalAtual() {
        const agora = new Date();
        const mes = String(agora.getMonth() + 1).padStart(2, "0");
        const dia = String(agora.getDate()).padStart(2, "0");
        return `${agora.getFullYear()}-${mes}-${dia}`;
    }

    function resumoProfissionais(procedimentos) {
        const profissionais = new Set(procedimentos.map(item => item.profissional).filter(Boolean));
        return ["Val", "Anny"].filter(nome => profissionais.has(nome)).join(" e ") || "Não informado";
    }

    function atualizarTotalEdt() {
        const total = Array.from(listaProcedimentosEdt.querySelectorAll(".valor-item-procedimento"))
            .reduce((soma, campo) => soma + lerValor(campo.value), 0);
        totalEdtAgendamento.value = formatarMoeda(total);
    }

    function criarCampoEdt(rotulo, classe, valorInicial = "") {
        const campo = document.createElement("div");
        campo.classList.add("campo");
        const label = document.createElement("label");
        const input = document.createElement("input");
        const id = `edt-procedimento-campo-${++idCampoProcedimentoEdt}`;
        label.htmlFor = id;
        label.textContent = rotulo;
        input.id = id;
        input.required = true;
        input.value = valorInicial;
        input.setAttribute("aria-label", rotulo);
        input.classList.add(classe);
        campo.append(label, input);
        return { campo, input };
    }

    function criarItemProcedimentoEdt(dados, somenteLeitura) {
        const item = document.createElement("div");
        item.classList.add("item-procedimento");

        const procedimentoCampo = criarCampoEdt(
            "Procedimento",
            "procedimento-item-input",
            dados.procedimento
        );
        procedimentoCampo.input.disabled = somenteLeitura;

        const profissionalCampo = document.createElement("div");
        profissionalCampo.classList.add("campo");
        const profissionalLabel = document.createElement("label");
        const profissionalSelect = document.createElement("select");
        const profissionalId = `edt-profissional-campo-${++idCampoProcedimentoEdt}`;
        profissionalLabel.htmlFor = profissionalId;
        profissionalSelect.required = !somenteLeitura;
        profissionalSelect.disabled = somenteLeitura;
        profissionalSelect.id = profissionalId;
        profissionalSelect.setAttribute("aria-label", "Profissional responsável");
        [["", "Selecione"], ["Val", "Val"], ["Anny", "Anny"]].forEach(([valor, texto]) => {
            const option = document.createElement("option");
            option.value = valor;
            option.textContent = texto;
            profissionalSelect.appendChild(option);
        });
        profissionalSelect.value = dados.profissional || "";
        profissionalLabel.textContent = "Profissional";
        profissionalCampo.append(profissionalLabel, profissionalSelect);

        const valorCampo = criarCampoEdt(
            "Valor",
            "valor-item-procedimento",
            dados.valor === null || dados.valor === undefined
                ? ""
                : formatarMoeda(Number(dados.valor))
        );
        valorCampo.input.type = "text";
        valorCampo.input.inputMode = "decimal";
        valorCampo.input.placeholder = "R$ 0,00";
        valorCampo.input.disabled = somenteLeitura;
        valorCampo.input.addEventListener("input", () => {
            valorCampo.input.setCustomValidity(
                valorCampo.input.value.trim() && lerValor(valorCampo.input.value) <= 0
                    ? "Informe um valor válido."
                    : ""
            );
            atualizarTotalEdt();
        });
        if (!somenteLeitura) {
            const remover = document.createElement("button");
            remover.type = "button";
            remover.classList.add("btn-remover");
            remover.setAttribute("aria-label", "Remover procedimento");
            remover.textContent = "✕";
            remover.addEventListener("click", () => {
                if (listaProcedimentosEdt.children.length === 1) {
                    procedimentoCampo.input.value = "";
                    profissionalSelect.value = "";
                    valorCampo.input.value = "";
                } else {
                    item.remove();
                }
                atualizarTotalEdt();
            });
            item.appendChild(remover);
        }

        item.append(procedimentoCampo.campo, profissionalCampo, valorCampo.campo);
        listaProcedimentosEdt.appendChild(item);
    }

    function definirProcedimentos(procedimentos, somenteLeitura, atribuicoes = []) {
        const itensProcedimento = procedimentos.map((procedimento, indice) => {
            const atribuicao = atribuicoes[indice] || {};
            return {
                procedimento,
                profissional: atribuicao.profissional || "",
                valor: atribuicao.valor !== null
                    && atribuicao.valor !== undefined
                    && atribuicao.valor !== ""
                    && Number.isFinite(Number(atribuicao.valor))
                    ? Number(atribuicao.valor)
                    : null
            };
        });
        if (!itensProcedimento.length) {
            itensProcedimento.push({
                procedimento: "",
                profissional: "",
                valor: null
            });
        }
        listaProcedimentosEdt.replaceChildren();
        itensProcedimento.forEach(item => {
            criarItemProcedimentoEdt(item, somenteLeitura);
        });
    }

    function preencherRelatorio(dados) {
        relatorioAtendimento.replaceChildren();
        const servicoItem = document.createElement("div");
        servicoItem.classList.add("item-relatorio", "item-relatorio-servico");
        const servicoTitulo = document.createElement("span");
        servicoTitulo.classList.add("rotulo-relatorio");
        servicoTitulo.textContent = "Serviços realizados";
        const listaServicos = document.createElement("ul");
        listaServicos.classList.add("lista-servicos-relatorio");
        dados.procedimentos.forEach(procedimento => {
            const servico = typeof procedimento === "string"
                ? { procedimento, valor: null }
                : procedimento;
            const linha = document.createElement("li");
            const nome = document.createElement("span");
            nome.classList.add("nome-servico-relatorio");
            nome.textContent = servico.procedimento;
            linha.appendChild(nome);
            if (servico.valor !== null && servico.valor !== undefined) {
                const separador = document.createElement("span");
                separador.classList.add("separador-servico-relatorio");
                separador.setAttribute("aria-hidden", "true");
                separador.textContent = "•";
                const valor = document.createElement("span");
                valor.classList.add("valor-servico-relatorio");
                valor.textContent = formatarMoeda(Number(servico.valor));
                linha.append(separador, valor);
            }
            listaServicos.appendChild(linha);
        });
        servicoItem.append(servicoTitulo, listaServicos);
        relatorioAtendimento.appendChild(servicoItem);

        const itens = [
            ["Cliente", dados.cliente],
            ["Profissional", dados.profissional],
            ["Data", dados.data],
            ["Horário", dados.horario.replace(":", "h")],
            ["Valor pago", dados.valor || "Valor não registrado"],
            ["Forma de pagamento", dados.formaPagamento],
            ["Observações", dados.observacoes || "Nenhuma observação registrada", "item-relatorio-observacoes"]
        ];

        itens.forEach(([rotulo, valor, classe]) => {
            const item = document.createElement("div");
            item.classList.add("item-relatorio");
            if (classe) item.classList.add(classe);
            const titulo = document.createElement("span");
            titulo.classList.add("rotulo-relatorio");
            titulo.textContent = rotulo;
            const conteudo = document.createElement("p");
            conteudo.textContent = valor;
            item.append(titulo, conteudo);
            relatorioAtendimento.appendChild(item);
        });
    }

    function preencherModal(agendamento) {
        const status = agendamento.dataset.status;
        const somenteLeitura = status === "concluido";
        const cliente = agendamento.querySelector(".cliente").textContent.trim();
        const procedimentos = agendamento.querySelector(".procedimento").textContent
            .split("•")
            .map(procedimento => procedimento.trim())
            .filter(Boolean);
        const profissionalEl = agendamento.querySelector(".profissional");
        const profissionalAnterior = Array.from(profissionalEl.childNodes)
            .filter(no => no.nodeType === Node.TEXT_NODE)
            .map(no => no.textContent)
            .join("")
            .trim();
        const horario = agendamento.closest(".linha-agenda").querySelector(".linha-hora p").textContent.trim();
        const data = agendamento.dataset.data || dataLocalAtual();
        const dataFormatada = new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
        const valor = agendamento.dataset.valor || "";
        const observacoes = agendamento.dataset.observacoes || "";
        const atribuicoesSalvas = agendamento.dataset.professionalAssignments
            ? JSON.parse(agendamento.dataset.professionalAssignments)
            : [];
        const atribuicoes = procedimentos.map((procedimento, indice) => {
            const atribuicaoSalva = atribuicoesSalvas[indice] || {};
            const profissionalSalvo = atribuicaoSalva.profissional
                || (!atribuicoesSalvas.length && ["Val", "Anny"].includes(profissionalAnterior)
                    ? profissionalAnterior
                    : "");
            return {
                procedimento,
                profissional: profissionalSalvo,
                valor: atribuicaoSalva.valor
            };
        });
        const profissional = resumoProfissionais(atribuicoes)
            === "Não informado" && !atribuicoesSalvas.length
            ? profissionalAnterior || "Não informado"
            : resumoProfissionais(atribuicoes);
        const formaPagamentoSelecionada = Array.from(formaPagamento.options)
            .find(opcao => opcao.value === agendamento.dataset.formaPagamento);
        const formaPagamentoRegistrada = formaPagamentoSelecionada
            ? formaPagamentoSelecionada.textContent.trim()
            : "Não informada";
        const formaPagamentoRelatorio = formaPagamentoSelecionada
            && formaPagamentoSelecionada.value === "credito"
            && agendamento.dataset.parcelas
            ? `${formaPagamentoRegistrada} (${agendamento.dataset.parcelas}x)`
            : formaPagamentoRegistrada;

        document.getElementById("titulo-edt-agendamento").textContent =
            somenteLeitura ? "Atendimento concluído" : "Detalhes do atendimento";
        document.getElementById("edt-cliente").value = cliente;
        document.getElementById("edt-data").value = data;
        document.getElementById("edt-horario").value = horario;
        document.getElementById("edt-valor").value = valor;
        document.getElementById("edt-observacoes").value = observacoes;
        definirProcedimentos(procedimentos, somenteLeitura, atribuicoes);
        preencherRelatorio({
            cliente,
            procedimentos: atribuicoes,
            profissional,
            data: dataFormatada,
            horario,
            valor,
            formaPagamento: formaPagamentoRelatorio,
            observacoes
        });

        formEdtAgendamento.querySelectorAll("input, select, textarea").forEach(campo => {
            campo.disabled = somenteLeitura;
        });
        const dadosFixosEmAndamento = status === "emandamento";
        ["edt-cliente", "edt-data", "edt-horario"].forEach(id => {
            document.getElementById(id).disabled = somenteLeitura || dadosFixosEmAndamento;
        });
        camposEdtAgendamento.hidden = somenteLeitura;
        relatorioAtendimento.hidden = !somenteLeitura;
        acoesEdtAgendamento.hidden = somenteLeitura;
        adicionarProcedimentoEdt.hidden = somenteLeitura;
        botaoExcluirAtendimento.hidden = status !== "naoiniciado";
        botaoCancelarEdt.hidden = somenteLeitura;
        botaoSalvarEdt.hidden = somenteLeitura;
    }

    adicionarProcedimentoEdt.addEventListener("click", () => {
        const novoItem = { procedimento: "", profissional: "", valor: null };
        criarItemProcedimentoEdt(novoItem, false);
    });

    formEdtAgendamento.addEventListener("submit", evento => {
        evento.preventDefault();
        if (!agendamentoEmEdicao) return;

        const cliente = document.getElementById("edt-cliente").value.trim();
        const data = document.getElementById("edt-data").value;
        const horario = document.getElementById("edt-horario").value;
        const valor = document.getElementById("edt-valor").value.trim();
        const observacoes = document.getElementById("edt-observacoes").value.trim();
        const procedimentos = Array.from(listaProcedimentosEdt.querySelectorAll(".item-procedimento"))
            .map(item => ({
                procedimento: item.querySelector(".procedimento-item-input").value.trim(),
                profissional: item.querySelector("select").value,
                valor: lerValor(item.querySelector(".valor-item-procedimento").value)
            }));

        agendamentoEmEdicao.querySelector(".cliente").textContent = cliente;
        agendamentoEmEdicao.querySelector(".procedimento").textContent =
            procedimentos.map(item => item.procedimento).join(" • ");

        const profissionalEl = agendamentoEmEdicao.querySelector(".profissional");
        const iconeProfissional = profissionalEl.querySelector("i");
        profissionalEl.replaceChildren(
            ...(iconeProfissional ? [iconeProfissional] : []),
            document.createTextNode(resumoProfissionais(procedimentos))
        );

        agendamentoEmEdicao.closest(".linha-agenda").querySelector(".linha-hora p").textContent = horario;
        agendamentoEmEdicao.dataset.data = data;
        agendamentoEmEdicao.dataset.valor = valor;
        agendamentoEmEdicao.dataset.observacoes = observacoes;
        agendamentoEmEdicao.dataset.professionalAssignments = JSON.stringify(procedimentos);
        fecharModal(overlayEdtAgendamento);
        agendamentoEmEdicao = null;
    });

    document.querySelectorAll(".fechar-modal-edt, .cancelarEdt").forEach(botao => {
        botao.addEventListener("click", () => {
            fecharModal(overlayEdtAgendamento);
            agendamentoEmEdicao = null;
        });
    });
})();