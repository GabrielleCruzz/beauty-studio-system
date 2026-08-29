const overlayClientes = document.getElementById("overlay-add-cliente")
const abrirModalClientes = document.getElementById("abrir-modal")
const fecharModalClientes = document.getElementById("fechar-modal")
const formClientes = document.querySelector(".form-add-cliente")

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

// Modal de adicionar novas clientes
abrirModalClientes.addEventListener("click", () => {
    abrirModal(overlayClientes);
});

fecharModalClientes.addEventListener("click", () => {
    fecharModal(overlayClientes, formClientes);
});

// Modal de ver mais informações da cliente

const overlayInfos = document.getElementById("overlay-ver-cliente")
const btnVerClientes = document.querySelectorAll(".btn-ver")
const fecharModalInfos = document.getElementById("fechar-modal-ver")
const formInfos = document.querySelector(".form-ver")

function configurarBtnVer(botao) {
    botao.addEventListener("click", () => {
        abrirModal(overlayInfos);
    });
}

btnVerClientes.forEach(configurarBtnVer);

fecharModalInfos.addEventListener("click", () => {
    fecharModal(overlayInfos, formInfos);
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

        if (desabilitado) {
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

const btnExcluirCliente = document.querySelectorAll('.btn-apagar');
const overlayApagar = document.getElementById('overlay-apagar');
const btnCancelar = document.getElementById('cancelar-excluir');
const btnConfirmar = document.getElementById('confirmar-excluir');
let clienteExcluir = null;

function configurarBtnExcluir(botao){
    botao.addEventListener("click", () => {
        abrirModal(overlayApagar);
        // guarda a linha do botão clicado
        clienteExcluir = botao.closest("tr");
    });
};

btnExcluirCliente.forEach(configurarBtnExcluir);

btnCancelar.addEventListener("click", () => {
    fecharModal(overlayApagar);
});

// Apaga a linha
btnConfirmar.addEventListener("click", () => {
    if (clienteExcluir) { // verifica se tem algo na linha
        clienteExcluir.remove(); // remove a linha
    }

    fecharModal(overlayApagar); // fecha o modal
    clienteExcluir = null;
});


// Adicionar um novo cliente na tabela

const inputNome = document.getElementById('nome');
const inputTel = document.getElementById('tel');
const inputData = document.getElementById('dataNascimento');
const textObs = document.getElementById('obs');
const tabelaClientes = document.querySelector('#tabelaClientes tbody');

formClientes.addEventListener("submit", (e) => {
    e.preventDefault(); // impede que recarregue

    // pega os valores
    const nome = inputNome.value;
    const telefone = inputTel.value;
    const data = inputData.value;
    const observacoes = textObs.value;

    // adiciona nova linha
    const novaLinha = document.createElement("tr");
    novaLinha.innerHTML = 
    `<td>${nome}</td>
    <td>${telefone}</td>
    <td>—</td>
    <td>—</td>
    <td>R$ 0,00</td>
    <td><p class="visitas">0x</p></td>
    <td><button class="btn-ver"><i class="ti ti-eye"></i> Ver</button></td>
    <td><button class="btn-apagar"><i class="ti ti-x"></i></button></td>`;
    tabelaClientes.appendChild(novaLinha);
    const btnVer = novaLinha.querySelector(".btn-ver");
    configurarBtnVer(btnVer);
    const btnExcluir = novaLinha.querySelector(".btn-apagar");
    configurarBtnExcluir(btnExcluir);
    fecharModal(overlayClientes, formClientes);
});