const containers = document.querySelectorAll(".content-container");

function showContainer(id) {

    const selected = document.getElementById(id);

    if (selected.classList.contains("show")) {
        selected.classList.remove("show");
        return;
    }

    containers.forEach(container => {
        container.classList.remove("show");
    });

    selected.classList.add("show");
}