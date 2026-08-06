const containers = document.querySelectorAll(".content-container");
const home = document.getElementById("home");

home.classList.add("show");

let activeContainer = null;

function toggleContainer(id) {

    const selected = document.getElementById(id);

    if (activeContainer === selected) {
        selected.classList.remove("show");
        home.classList.add("show");
        activeContainer = null;
        return;
    }

    containers.forEach(container => {
        container.classList.remove("show");
    });

    selected.classList.add("show");
    activeContainer = selected;
}