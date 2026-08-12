/* START SCROLL TITLE SCRIPT */

let msg = "bruce ";
let position = 0;

function scrolltitle() {
    document.title =
        msg.substring(position, msg.length) +
        msg.substring(0, position);

    position++;

    if (position > msg.length) {
        position = 0;
    }

    window.setTimeout(scrolltitle, 250);
}

scrolltitle();

/* END SCRIPT */


/* START MOUSE PARALLAX SCRIPT */

let backgroundNumber = parseInt(
    localStorage.getItem("backgroundNumber")
) || 0;

backgroundNumber++;

if (backgroundNumber > 3) {
    backgroundNumber = 1;
}

localStorage.setItem("backgroundNumber", backgroundNumber);

document.body.style.setProperty(
    "--background-url",
    `url("images/background-${backgroundNumber}.jpg")`
);

document.addEventListener("mousemove", function (event) {

    let x = (event.clientX - window.innerWidth / 2) / 35 * -1;
    let y = (event.clientY - window.innerHeight / 2) / 35 * -1;

    document.body.style.setProperty(
        "--background-transform",
        `translate(${x}px, ${y}px) scale(1.1)`
    );

});

/* END SCRIPT */


/* START CONTAINER WINDOW SCRIPT */

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

        info.style.height = next.scrollHeight + "px";

        setTimeout(() => {

            next.style.transition = `opacity ${fadeTime}ms ease`;
            next.style.opacity = "1";

            current = next;
            busy = false;

        }, resizeTime);

    }, fadeTime);
}


/* END SCRIPT */


/* START MOVEABLE ELEMENTS SCRIPT */

$(function () {

    $("#status").draggable({
        containment: "window"
    });


    $("#resetStatus").click(function () {

        $("#status").css({
            left: "55%",
            top: "30%"
        });

    });

});

/* END SCRIPT */