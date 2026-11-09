(() => {
    const storageKey = "beautyStudio.clients.v1";
    const list = document.getElementById("lista-clientes");
    const detailForm = document.getElementById("form-detalhes-cliente");

    function lerClientes() {
        const dados = localStorage.getItem(storageKey);
        const clientes = dados ? JSON.parse(dados) : [];
        if (!Array.isArray(clientes) || clientes.some(cliente =>
            !cliente
            || typeof cliente.id !== "string"
            || typeof cliente.nome !== "string"
            || typeof cliente.telefone !== "string"
            || typeof cliente.observacoes !== "string"
        )) {
            throw new Error("Os cadastros de clientes armazenados estão inválidos.");
        }
        return clientes;
    }

    function salvarClientes(clientes) {
        localStorage.setItem(storageKey, JSON.stringify(clientes));
    }

    function criarId() {
        return crypto.randomUUID
            ? crypto.randomUUID()
            : `cliente-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    function mostrarData() {
        const agora = new Date();
        const data = agora.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
        const campoData = document.getElementById("data");
        if (campoData) campoData.textContent = `${data.charAt(0).toLocaleUpperCase("pt-BR")}${data.slice(1)}`;
    }

    function formatarTelefone(campo) {
        let valor = campo.value.replace(/\D/g, "").slice(0, 11);
        valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
        campo.value = valor;
    }

    mostrarData();

    if (list) {
        const search = document.getElementById("busca-cliente");
        const empty = document.getElementById("nenhum-cliente");
        const overlay = document.getElementById("overlay-add-cliente");
        const form = document.getElementById("form-add-cliente");
        const addButton = document.getElementById("abrir-modal");
        const closeButton = document.getElementById("fechar-modal");

        function renderizarClientes(clientes) {
            list.replaceChildren();
            clientes.forEach(cliente => {
                const card = document.createElement("article");
                card.className = "cliente-card";

                const info = document.createElement("div");
                info.className = "cliente-card-info";
                const nome = document.createElement("h2");
                nome.textContent = cliente.nome;
                const telefone = document.createElement("p");
                telefone.textContent = cliente.telefone;
                info.append(nome, telefone);

                const link = document.createElement("a");
                link.className = "btn-ver-cliente";
                link.href = `./client-details.html?id=${encodeURIComponent(cliente.id)}`;
                link.setAttribute("aria-label", `Ver informações de ${cliente.nome}`);
                const texto = document.createElement("span");
                texto.textContent = "Mais informações";
                const icone = document.createElement("i");
                icone.className = "ti ti-arrow-up-right";
                icone.setAttribute("aria-hidden", "true");
                link.append(texto, icone);
                card.append(info, link);
                list.appendChild(card);
            });
            empty.hidden = clientes.length > 0;
        }

        let clientes = lerClientes();
        if (!clientes.length) {
            clientes = Array.from(list.querySelectorAll(".cliente-card")).map(card => ({
                id: card.dataset.id,
                nome: card.dataset.nome,
                telefone: card.dataset.telefone,
                observacoes: ""
            }));
            salvarClientes(clientes);
        }
        renderizarClientes(clientes);

        search.addEventListener("input", () => {
            const termo = search.value.trim().toLocaleLowerCase("pt-BR");
            renderizarClientes(clientes.filter(cliente =>
                `${cliente.nome} ${cliente.telefone}`.toLocaleLowerCase("pt-BR").includes(termo)
            ));
        });

        function fecharModal() {
            overlay.classList.remove("abrir");
            document.body.style.overflow = "";
            form.reset();
        }

        addButton.addEventListener("click", () => {
            overlay.classList.add("abrir");
            document.body.style.overflow = "hidden";
        });
        closeButton.addEventListener("click", fecharModal);
        overlay.addEventListener("click", evento => {
            if (evento.target === overlay) fecharModal();
        });
        document.getElementById("tel").addEventListener("input", evento => {
            formatarTelefone(evento.currentTarget);
        });
        form.addEventListener("submit", evento => {
            evento.preventDefault();
            const nome = document.getElementById("nome").value.trim();
            const telefone = document.getElementById("tel").value.trim();
            if (!nome || !telefone) return;

            const cliente = {
                id: criarId(),
                nome,
                telefone,
                observacoes: document.getElementById("obs").value.trim()
            };
            clientes = [...clientes, cliente];
            salvarClientes(clientes);
            renderizarClientes(clientes);
            fecharModal();
        });
    }

    if (!detailForm) return;

    const clienteId = new URLSearchParams(window.location.search).get("id");
    const clientes = lerClientes();
    const cliente = clientes.find(item => item.id === clienteId);
    const detalhes = document.getElementById("detalhes-cliente");

    if (!cliente) return;

    detalhes.hidden = false;
    document.title = `${cliente.nome} | Informações da cliente`;
    document.getElementById("titulo-cliente").textContent = cliente.nome;
    const nome = document.getElementById("detalhe-nome");
    const telefone = document.getElementById("detalhe-telefone");
    const observacoes = document.getElementById("detalhe-observacoes");

    function preencherFormulario() {
        nome.value = cliente.nome;
        telefone.value = cliente.telefone;
        observacoes.value = cliente.observacoes;
    }

    preencherFormulario();
})();
