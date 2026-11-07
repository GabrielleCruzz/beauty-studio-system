(() => {

    function mostrarData() {
        const data = new Date();

        const diasSemana = [
            "Domingo",
            "Segunda-feira",
            "Terça-feira",
            "Quarta-feira",
            "Quinta-feira",
            "Sexta-feira",
            "Sábado"
        ];

        const meses = [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro"
        ];

        const diaSemana = diasSemana[data.getDay()];
        const dia = data.getDate();
        const mes = meses[data.getMonth()];
        const ano = data.getFullYear();

        document.getElementById("data").innerText =
            `${diaSemana}, ${dia} de ${mes} de ${ano}`;
    }

    mostrarData();
    if (!document.querySelector(".form-agendamento")) return;

    // Modal de novo agendamento

    const overlayAddCliente = document.getElementById("overlay-add-cliente");
    const abrirModalClientes = document.getElementById("abrir-modal");
    const fecharModalClientes = document.getElementById("fechar-modal");
    const cancelar = document.querySelector(".cancelar");
    const formAgendamento = document.querySelector(".form-agendamento");
    const listaProcedimentos = document.getElementById("lista-procedimentos");
    const totalAgendamento = document.getElementById("valor-agendamento");
    let idCampoProcedimento = 0;

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

    function atualizarTotalAgendamento() {
        const total = Array.from(listaProcedimentos.querySelectorAll(".valor-item-procedimento"))
            .reduce((soma, campo) => soma + lerValor(campo.value), 0);
        totalAgendamento.value = formatarMoeda(total);
    }

    function criarCampoProcedimento(rotulo, classe, valorInicial = "") {
        const campo = document.createElement("div");
        campo.classList.add("campo");
        const label = document.createElement("label");
        const input = document.createElement("input");
        const id = `procedimento-campo-${++idCampoProcedimento}`;
        label.htmlFor = id;
        label.textContent = rotulo;
        input.id = id;
        input.required = true;
        input.value = valorInicial;
        input.setAttribute("aria-label", rotulo);
        campo.append(label, input);
        input.classList.add(classe);
        return { campo, input };
    }

    function criarLinhaProcedimento(container, dados = {}) {
        const item = document.createElement("div");
        item.classList.add("item-procedimento");

        const procedimento = criarCampoProcedimento(
            "Procedimento",
            "procedimento-item-input",
            dados.procedimento || ""
        );
        const profissionalCampo = document.createElement("div");
        profissionalCampo.classList.add("campo");
        const profissionalLabel = document.createElement("label");
        const profissionalSelect = document.createElement("select");
        const profissionalId = `profissional-campo-${idCampoProcedimento}`;
        profissionalLabel.htmlFor = profissionalId;
        profissionalSelect.id = profissionalId;
        profissionalLabel.textContent = "Profissional";
        profissionalSelect.required = true;
        profissionalSelect.setAttribute("aria-label", "Profissional responsável");
        [["", "Selecione"], ["Val", "Val"], ["Anny", "Anny"]].forEach(([valor, texto]) => {
            const option = document.createElement("option");
            option.value = valor;
            option.textContent = texto;
            profissionalSelect.appendChild(option);
        });
        profissionalSelect.value = dados.profissional || "";
        profissionalCampo.append(profissionalLabel, profissionalSelect);

        const valor = criarCampoProcedimento("Valor", "valor-item-procedimento", dados.valor || "");
        valor.input.type = "text";
        valor.input.inputMode = "decimal";
        valor.input.placeholder = "R$ 0,00";
        valor.input.addEventListener("input", () => {
            valor.input.setCustomValidity(
                valor.input.value.trim() && lerValor(valor.input.value) <= 0
                    ? "Informe um valor válido."
                    : ""
            );
            atualizarTotalAgendamento();
        });

        const remover = document.createElement("button");
        remover.type = "button";
        remover.classList.add("btn-remover");
        remover.setAttribute("aria-label", "Remover procedimento");
        remover.textContent = "✕";
        remover.addEventListener("click", () => {
            if (container.children.length === 1) {
                procedimento.input.value = "";
                profissionalSelect.value = "";
                valor.input.value = "";
            } else {
                item.remove();
            }
            atualizarTotalAgendamento();
        });

        item.append(procedimento.campo, profissionalCampo, valor.campo, remover);
        container.appendChild(item);
        return item;
    }

    document.getElementById("adicionar-procedimento").addEventListener("click", () => {
        criarLinhaProcedimento(listaProcedimentos);
    });

    criarLinhaProcedimento(listaProcedimentos);
    atualizarTotalAgendamento();

    function abrirModal(overlay) {
        overlay.classList.add("abrir");
        document.body.style.overflow = "hidden";
    }

    function fecharModal(overlay, form = null) {
        overlay.classList.remove("abrir");
        document.body.style.overflow = "auto";

        if (form) {
            form.reset();
            listaProcedimentos.replaceChildren();
            criarLinhaProcedimento(listaProcedimentos);
            atualizarTotalAgendamento();
        }
    }

    abrirModalClientes.addEventListener("click", () => {
        abrirModal(overlayAddCliente);
    });

    fecharModalClientes.addEventListener("click", () => {
        fecharModal(overlayAddCliente, formAgendamento);
    });

    cancelar.addEventListener("click", () => {
        fecharModal(overlayAddCliente, formAgendamento);
    });

    formAgendamento.addEventListener("submit", evento => {
        const agenda = document.querySelector(".agenda");
        if (!agenda) return;

        evento.preventDefault();
        const itens = Array.from(listaProcedimentos.querySelectorAll(".item-procedimento"));
        const assignments = itens.map(item => ({
            procedimento: item.querySelector(".procedimento-item-input").value.trim(),
            profissional: item.querySelector("select").value,
            valor: lerValor(item.querySelector(".valor-item-procedimento").value)
        }));
        const linhaAgenda = document.createElement("div");
        linhaAgenda.classList.add("linha-agenda");

        const linhaHora = document.createElement("div");
        linhaHora.classList.add("linha-hora");
        const horaTexto = document.createElement("p");
        horaTexto.textContent = formAgendamento.querySelector("#horario-agendamento").value;
        linhaHora.appendChild(horaTexto);

        const atendimento = document.createElement("div");
        atendimento.classList.add("linha-cliente", "naoiniciado");
        atendimento.dataset.status = "naoiniciado";
        atendimento.dataset.data = formAgendamento.querySelector("#data-agendamento").value;
        atendimento.dataset.valor = totalAgendamento.value.trim();
        atendimento.dataset.observacoes =
            formAgendamento.querySelector("#observacoes-agendamento").value.trim();
        atendimento.dataset.professionalAssignments = JSON.stringify(assignments);

        const info = document.createElement("div");
        info.classList.add("info-agendamento");
        const cliente = document.createElement("p");
        cliente.classList.add("cliente");
        cliente.textContent = formAgendamento.querySelector("#cliente-agendamento").value.trim();
        const procedimentos = document.createElement("p");
        procedimentos.classList.add("procedimento");
        procedimentos.textContent = assignments.map(item => item.procedimento).join(" • ");
        const responsaveis = Array.from(new Set(assignments.map(item => item.profissional)));
        const profissional = document.createElement("p");
        profissional.classList.add("profissional");
        const icone = document.createElement("i");
        icone.classList.add("ti", "ti-users");
        profissional.append(icone, document.createTextNode(
            ["Val", "Anny"].filter(nome => responsaveis.includes(nome)).join(" e ")
        ));
        info.append(cliente, procedimentos, profissional);

        const acoes = document.createElement("div");
        acoes.classList.add("acoes-agendamento");
        const botaoStatus = document.createElement("button");
        botaoStatus.classList.add("btn-status");
        const botaoEditar = document.createElement("button");
        botaoEditar.classList.add("btn-editar");
        botaoEditar.title = "Editar";
        const iconeEditar = document.createElement("i");
        iconeEditar.classList.add("ti", "ti-pencil");
        botaoEditar.appendChild(iconeEditar);
        acoes.append(botaoStatus, botaoEditar);
        atendimento.append(info, acoes);
        linhaAgenda.append(linhaHora, atendimento);
        agenda.appendChild(linhaAgenda);

        fecharModal(overlayAddCliente, formAgendamento);
    });
})();