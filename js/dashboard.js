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

    // Modal de novo agendamento

    const overlayAddCliente = document.getElementById("overlay-add-cliente");
    const abrirModalClientes = document.getElementById("abrir-modal");
    const fecharModalClientes = document.getElementById("fechar-modal");
    const cancelar = document.querySelector(".cancelar");
    const formAgendamento = document.querySelector(".form-agendamento");
    const selProcedimento = document.getElementById("procedimento");
    const listaProcedimentos = document.getElementById("lista-procedimentos");

    function abrirModal(overlay) {
        overlay.classList.add("abrir");
        document.body.style.overflow = "hidden";
    }

    function fecharModal(overlay, form = null) {
        overlay.classList.remove("abrir");
        document.body.style.overflow = "auto";

        if (form) {
            form.reset();
            procedimentosSelecionados = [];
            listaProcedimentos.innerHTML = "";
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

    // Selecionar vários procedimentos

    let procedimentosSelecionados = [];
    selProcedimento.addEventListener("change", () => {

        const procedimento = selProcedimento.value;

        if (!procedimento) return;

        if (procedimentosSelecionados.includes(procedimento)) {
            selProcedimento.value = "";
            return;
        }

        procedimentosSelecionados.push(procedimento);
        criarItemProcedimento(procedimento);
        selProcedimento.value = "";
    });

    function criarItemProcedimento(nome) {

        const item = document.createElement("div");
        item.classList.add("item-procedimento");

        item.innerHTML = `
            <span>${nome}</span>
            <button type="button" class="btn-remover">✕</button>
        `;

        item.querySelector(".btn-remover").addEventListener("click", () => {
            procedimentosSelecionados =
                procedimentosSelecionados.filter(p => p !== nome);
            item.remove();
        });
        listaProcedimentos.appendChild(item);
    }
})();