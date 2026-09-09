(() => {

    // Atualizar status

    const agendamentos = document.querySelectorAll(".linha-cliente");
    let agendamentoAtual = null;
    const overlayCobranca = document.querySelector(".overlay-cobranca");
    const fecharCobranca = document.getElementById("fechar-cobranca");
    const confirmarPagamento = document.getElementById("confirmarPagamento");
    const valorPagamento = document.getElementById("valorPagamento");
    const erroPagamento = document.getElementById("erroPagamento");

    agendamentos.forEach((agendamento) => {
        const status = agendamento.dataset.status;
        agendamento.classList.add(status);
        const botao = agendamento.querySelector(".btn-status");
        atualizarStatus(agendamento, botao);

        botao.addEventListener("click", () => {
            const statusAtual = agendamento.dataset.status;

            if (statusAtual === "naoiniciado") {
                agendamento.dataset.status = "emandamento";
                atualizarStatus(agendamento, botao);
            } else if (statusAtual === "emandamento") {
                agendamentoAtual = agendamento;
                overlayCobranca.classList.add("abrir");
            }
        });
    });

    fecharCobranca.addEventListener("click", () => {
        overlayCobranca.classList.remove("abrir");
    });

    confirmarPagamento.addEventListener("click", () => {

        if (!agendamentoAtual) return;
        const valor = valorPagamento.value.trim();

        if (valor === "" || Number(valor) <= 0) {
            erroPagamento.classList.add("mostrar");
            setTimeout(() => {
                erroPagamento.classList.remove("mostrar");
            }, 3000);
            return;
        }

        agendamentoAtual.dataset.status = "concluido";
        const botao = agendamentoAtual.querySelector(".btn-status");
        atualizarStatus(agendamentoAtual, botao);
        overlayCobranca.classList.remove("abrir");
        valorPagamento.value = "";

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

    // Modais de edição

    const overlayEdtNaoIniciado = document.getElementById("overlay-edt-naoiniciado");
    const overlayEdtEmAndamento = document.getElementById("overlay-edt-emandamento");
    const overlayEdtConcluido = document.getElementById("overlay-edt-concluido");
    const btnEditar = document.querySelectorAll(".btn-editar");

    btnEditar.forEach((botao) => {

        botao.addEventListener("click", () => {

            const agendamento =
                botao.closest(".linha-cliente");

            const status =
                agendamento.dataset.status;

            switch (status) {

                case "naoiniciado":
                    abrirModal(overlayEdtNaoIniciado);
                    break;

                case "emandamento":
                    abrirModal(overlayEdtEmAndamento);
                    break;

                case "concluido":
                    abrirModal(overlayEdtConcluido);
                    break;
            }
        });
    });

    const botoesFecharEdt = document.querySelectorAll(".fechar-modal-edt");

    botoesFecharEdt.forEach((botao) => {
        botao.addEventListener("click", () => {
            const modal =
                botao.closest(".overlay");
            fecharModal(modal);
        });
    });

    const botoesCancelarEdt =
        document.querySelectorAll(".cancelarEdt");

    botoesCancelarEdt.forEach((botao) => {
        botao.addEventListener("click", () => {
            const modal =
                botao.closest(".overlay");
            fecharModal(modal);
        });
    });
    
    // Formulários de edição

    const formEdtAgendamento = document.querySelector(".edt-form-agendamento");

    if (formEdtAgendamento) {

        const selectProcedimento = formEdtAgendamento.querySelector("#edt-procedimento");
        const listaProcedimentosEdt = document.getElementById("edt-lista-procedimentos");
        let procedimentosSelecionadosEdt = [];
        selectProcedimento.addEventListener("change", () => {

            const procedimento =
                selectProcedimento.value;

            if (!procedimento) return;

            if (procedimentosSelecionadosEdt.includes(procedimento)) {
                selectProcedimento.value = "";
                return;
            }

            procedimentosSelecionadosEdt.push(procedimento);
            criarItemProcedimentoEdt(procedimento);
            selectProcedimento.value = "";
        });

        function criarItemProcedimentoEdt(nome) {

            const item = document.createElement("div");
            item.classList.add("item-procedimento");

            item.innerHTML = `
                <span>${nome}</span>
                <button type="button" class="btn-remover">✕</button>
            `;

            item.querySelector(".btn-remover").addEventListener("click", () => {

                procedimentosSelecionadosEdt =
                    procedimentosSelecionadosEdt.filter(p => p !== nome);

                item.remove();

            });

            listaProcedimentosEdt.appendChild(item);

        }

        formEdtAgendamento
            .querySelector(".cancelarEdt")
            .addEventListener("click", (e) => {
                e.preventDefault();
                fecharModal(overlayEdtNaoIniciado);
            });
    }
    
})();