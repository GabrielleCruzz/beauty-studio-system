// Mudar o status dos agendamentos

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

        if (statusAtual == "naoiniciado") {
            agendamento.dataset.status = "emandamento";
            atualizarStatus(agendamento, botao);
        } else if (statusAtual == "emandamento") {
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
    if (valor == "" || valor <= 0) {
        erroPagamento.classList.add("mostrar");
        setTimeout(() => {
            erroPagamento.classList.remove("mostrar");
        }, 3000);
        return;
    }
    agendamentoAtual.dataset.status = "concluido";
    const botao = agendamentoAtual.querySelector(".btn-status");
    atualizarStatus(agendamentoAtual, botao
    );
    overlayCobranca.classList.remove("abrir");
});

function atualizarStatus(agendamento, botao) {
    const status = agendamento.dataset.status;
    agendamento.classList.remove(
        "naoiniciado", "emandamento", "concluido"
    );
    agendamento.classList.add(status);
    botao.disabled = false;

    // Atualiza os textos dos botões
    if (status == "naoiniciado") {
        botao.innerText = "Iniciar procedimento";
    }
    else if (status == "emandamento") {
        botao.innerText = "Abrir cobrança";
    }
    else if (status == "concluido") {
        botao.innerText = "Concluído";
    }
}