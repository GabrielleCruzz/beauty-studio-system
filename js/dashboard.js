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

    const dataFormatada = `${diaSemana}, ${dia} de ${mes} de ${ano}`;

    document.getElementById("data").innerText = dataFormatada;
}

mostrarData();


// Modal de novo agendamento

const overlayAddCliente = document.getElementById("overlay-add-cliente");
const abrirModalClientes = document.getElementById("abrir-modal");
const fecharModalClientes = document.getElementById("fechar-modal");
const cancelar = document.querySelector(".cancelar");
const formAgendamento = document.querySelector(".form-agendamento")
const selectProcedimento = document.getElementById("procedimento");
const listaProcedimentos = document.getElementById("lista-procedimentos");

// funções de abrir e fechar modais
function abrirModal(overlay) {
    overlay.classList.add("abrir");
    document.body.style.overflow = "hidden"; // impede que a página role quando o modal estiver aberto
}

function fecharModal(overlay, form = null) {
    overlay.classList.remove("abrir");
    document.body.style.overflow = "auto"; // desbloqueia a rolagem

    if (form) {
        form.reset(); // apaga as informações do formulário
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

selectProcedimento.addEventListener("change", () => {
    const procedimento = selectProcedimento.value;

    if (!procedimento) return;

    // evita repetir o mesmo procedimento
    if (procedimentosSelecionados.includes(procedimento)) {
        selectProcedimento.value = "";
        return;
    }

    procedimentosSelecionados.push(procedimento);
    criarItemProcedimento(procedimento);
    selectProcedimento.value = "";
});

function criarItemProcedimento(nome) {
    const item = document.createElement("div");
    item.classList.add("item-procedimento");

    item.innerHTML = `
        <span>${nome}</span>
        <button class="btn-remover">✕</button>
    `;

    const botaoRemover = item.querySelector(".btn-remover");
    botaoRemover.addEventListener("click", () => {
        procedimentosSelecionados =
            procedimentosSelecionados.filter(p => p !== nome);

        item.remove();
    });

    listaProcedimentos.appendChild(item);
}