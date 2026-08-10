const info = document.getElementById("info");

const pages = {
    home: document.getElementById("home"),
    about: document.getElementById("more")
};

const fadeTime = 250;
const resizeTime = 350;

let current = pages.home;
let busy = false;

current.classList.add("show");
current.style.opacity = "1";

requestAnimationFrame(() => {
    info.style.height = current.scrollHeight + "px";
});

function toggleContainer() {

    if (busy) return;

    let next;

    if (current === pages.home) {
        next = pages.about;
    } else {
        next = pages.home;
    }

    busy = true;

    document.getElementById("toggleButton").textContent =
        next === pages.about ? "▲ back" : "▼ more";

    current.style.transition = `opacity ${fadeTime}ms ease`;
    current.style.opacity = "0";

    setTimeout(() => {

        current.classList.remove("show");

        next.classList.add("show");
        next.style.opacity = "0";

        const newHeight = next.scrollHeight;

        info.style.height = newHeight + "px";

        setTimeout(() => {

            next.style.transition = `opacity ${fadeTime}ms ease`;
            next.style.opacity = "1";

            current = next;

            busy = false;

        }, resizeTime);

    }, fadeTime);
}