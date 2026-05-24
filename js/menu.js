fetch("menu.html")
    .then(response => response.text())
    .then(data => {

        document.getElementById("menu").innerHTML = data;

        ativarMenu();

    });

function ativarMenu() {

    const paginaAtual = window.location.href;

    const links = document.querySelectorAll(".menu a");

    links.forEach(link => {

        if (paginaAtual.includes(link.getAttribute("href"))) {
            link.classList.add("active");
        }

    });

}