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


// Modal

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


// Mudar o status dos agendamentos

const agendamentos = document.querySelectorAll(".linha-cliente");

agendamentos.forEach((agendamento) => {
    const status = agendamento.dataset.status;
    agendamento.classList.add(status);

    const botao = agendamento.querySelector(".btn-status");
    atualizarStatus(agendamento, botao);

    botao.addEventListener("click", () => {
        const statusAtual = agendamento.dataset.status;

        if (statusAtual == "naoiniciado") {
            agendamento.dataset.status = "emandamento";
        } else if (statusAtual == "emandamento") {
            agendamento.dataset.status = "concluido";
        }
        atualizarStatus(agendamento, botao);
    });
});

function atualizarStatus(agendamento, botao) {
    const status = agendamento.dataset.status;
    agendamento.classList.remove(
        "naoiniciado", "emandamento", "concluido"
    );
    agendamento.classList.add(status);

    // Atualiza os textos dos botões
    if (status == "naoiniciado") {
        botao.innerText =
            "Iniciar procedimento";
    }
    else if (status == "emandamento") {
        botao.innerText =
            "Abrir cobrança";
    }
    else if (status == "concluido") {
        botao.innerText =
            "Concluído";
    }
}