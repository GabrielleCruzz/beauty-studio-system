// Modal de adicionar novas clientes

const overlayClientes = document.querySelector(".overlay-add-cliente")
const abrirModalClientes = document.getElementById("abrir-modal")
const fecharModalClientes = document.getElementById("fechar-modal")
const formClientes = document.querySelector(".form-add-cliente")

abrirModalClientes.addEventListener("click", () => {
    overlayClientes.classList.add("abrir");
    document.body.style.overflow = "hidden"; // impede que a página role quando o modal estiver aberto
});

fecharModalClientes.addEventListener("click", () => {
    overlayClientes.classList.remove("abrir");
    document.body.style.overflow = "auto"; // desbloqueia a rolagem
    formClientes.reset(); // apaga as informações do formulário
});

// Modal de ver mais informações da cliente

const overlayInfos = document.querySelector(".overlay-ver-cliente")
const abrirModalInfos = document.querySelectorAll(".btn-ver")
const fecharModalInfos = document.getElementById("fechar-modal-ver")
const formInfos = document.querySelector(".form-ver")

abrirModalInfos.forEach((btn) => {
    btn.addEventListener("click", () => {
        overlayInfos.classList.add("abrir");
        document.body.style.overflow = "hidden";
    });
});

fecharModalInfos.addEventListener("click", () => {
    overlayInfos.classList.remove("abrir");
    document.body.style.overflow = "auto";
    formInfos.reset();
});

// Formatação do número de telefone

const tel = document.getElementById("tel");

tel.addEventListener("input", (e) => {
    let valor = e.target.value.replace(/\D/g, "");
    valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    e.target.value = valor;
});

// Formatação da data de nascimento

const dataNascimento = document.getElementById("dataNascimento");

dataNascimento.addEventListener("input", (e) => {
    let valor = e.target.value.replace(/\D/g, "");
    valor = valor.replace(/^(\d{2})(\d)/, "$1/$2");
    valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    e.target.value = valor;
});


// Permite editar as infromações 

const btnEditar = document.querySelectorAll('.editar');

btnEditar.forEach((botao) => {
    botao.addEventListener('click', () => {
        const container = botao.parentElement;
        const campo = container.querySelector('.campo');

        const desabilitado = campo.disabled;

        if(desabilitado) {
            // entra no modo de edição
            campo.disabled = false;

            // muda o icone
            botao.classList.remove('ti-pencil');
            botao.classList.add('ti-check');
        } else {
            // salva e sai do modo de edição
            campo.disabled = true;

            // volta ícone para lápis
            botao.classList.remove('ti-check');
            botao.classList.add('ti-pencil');
        }
    });
});


// Modal de confirmação para excluir clientes

const apagar = document.querySelectorAll('.btn-apagar');
const overlayApagar = document.querySelector('.overlay-apagar');
const btnCancelar = document.getElementById('cancelar-excluir');
const btnConfirmar = document.getElementById('confirmar-excluir');
let clienteExcluir = null;

apagar.forEach((btn) => {
    btn.addEventListener("click", () => {
        overlayApagar.classList.add("abrir");
        document.body.style.overflow = "hidden";
        // guarda a linha do botão clicado
        clienteExcluir = btn.closest("tr");
    });
});

btnCancelar.addEventListener("click", () => {
    overlayApagar.classList.remove("abrir");
    document.body.style.overflow = "auto";
});

// Apaga a linha
btnConfirmar.addEventListener("click", () => {
    if (clienteExcluir) { // verifica se tem algo na linha
        clienteExcluir.remove(); // remove a linha
    }

    overlayApagar.classList.remove("abrir"); // fecha o modal
});