const containers = document.querySelectorAll(".content-container");
let activeContainer = null;

function toggleContainer(id) {
    const selected = document.getElementById(id);

    // If the clicked container is already open, close it
    if (activeContainer === selected) {
        selected.classList.remove("show");
        activeContainer = null;
        return;
    }

    // Close all containers
    containers.forEach(container => {
        container.classList.remove("show");
    });

    // Open the selected one
    selected.classList.add("show");
    activeContainer = selected;
}