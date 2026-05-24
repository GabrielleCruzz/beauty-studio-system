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

const overlay = document.querySelector(".overlay");
const abrirModal = document.getElementById("abrir-modal");
const fecharModal = document.getElementById("fechar-modal");
const cancelar = document.querySelector(".cancelar");
const form = document.querySelector(".form-agendamento")
const selectProcedimento = document.getElementById("procedimento");
const listaProcedimentos = document.getElementById("lista-procedimentos");

abrirModal.addEventListener("click", () => {
    overlay.classList.add("abrir");
    document.body.style.overflow = "hidden";
});

fecharModal.addEventListener("click", () => {
    overlay.classList.remove("abrir");
    document.body.style.overflow = "auto";
    form.reset();
});

cancelar.addEventListener("click", () => {
    overlay.classList.remove("abrir");
    document.body.style.overflow = "auto"
    form.reset();
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