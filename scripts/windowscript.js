const containers = document.querySelectorAll(".content-container");
const pageSelect = document.getElementById("pageSelect");

function showContainer(id) {

    if (id === "") return;

    containers.forEach(container => {
        container.classList.remove("show");
    });

    document.getElementById(id).classList.add("show");
}

function closeContainer() {

    containers.forEach(container => {
        container.classList.remove("show");
    });

    pageSelect.value = "";
}