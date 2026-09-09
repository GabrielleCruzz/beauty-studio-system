const caminhoMenu = new URL("../components/menu.html", document.currentScript.src);

fetch(caminhoMenu)
    .then(response => response.text())
    .then(data => {

        document.getElementById("menu").innerHTML = data;

        const links = document.querySelectorAll(".menu a");
        const estaNasPages = window.location.pathname.includes("/pages/");

        links[0].href = estaNasPages ? "../index.html" : "./index.html";
        links[1].href = estaNasPages ? "./schedule.html" : "./pages/schedule.html";
        links[2].href = estaNasPages ? "./finance.html" : "./pages/finance.html";
        links[3].href = estaNasPages ? "./clients.html" : "./pages/clients.html";

        ativarMenu();

    });

function ativarMenu() {

    const paginaAtual = window.location.pathname;

    const links = document.querySelectorAll(".menu a");

    links.forEach(link => {

        const destino = new URL(link.href);

        if (destino.pathname === paginaAtual) {
            link.classList.add("active");
        }

    });

}