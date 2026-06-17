// Modal de adicionar novas clientes

const overlayClientes = document.querySelector(".overlay-add-cliente")
const abrirModalClientes = document.getElementById("abrir-modal")
const fecharModalClientes = document.getElementById("fechar-modal")
const formClientes = document.querySelector(".form-add-cliente")

abrirModalClientes.addEventListener("click", () => {
    overlayClientes.classList.add("abrir");
    document.body.style.overflow = "hidden";
});

fecharModalClientes.addEventListener("click", () => {
    overlayClientes.classList.remove("abrir");
    document.body.style.overflow = "auto";
    formClientes.reset();
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
