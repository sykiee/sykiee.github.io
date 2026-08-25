/* a lot of this is poached from around the internet and shit,
   but works for my site :) */

/* ──────── START CLICK SOUND SCRIPT ─────────────────────────────── */

const clickSound = document.getElementById("mouseclick");

document.addEventListener("click", function () {

    clickSound.currentTime = 0;
    clickSound.play();

});

/* ──────── END CLICK SOUND SCRIPT ──────────────────────────────── */

/* ──────── START BACKGROUND CHANGE SCRIPT ─────────────────────────────── */

// change background image on site refresh

let backgroundNumber =
    parseInt(localStorage.getItem("backgroundNumber")) || 0;

backgroundNumber++;

if (backgroundNumber > 3) {
    backgroundNumber = 1;
}

localStorage.setItem(
    "backgroundNumber",
    backgroundNumber
);

document.body.style.setProperty(
    "--background-url",
    `url("images/background-${backgroundNumber}.jpg")`
);

/* ──────── END BACKGROUND CHANGE SCRIPT ──────────────────────────────── */


/* ──────── START CONTAINER WINDOW SCRIPT ─────────────────────── */

// page selector for gay little carrd.co function lol

const info = document.getElementById("info");

const pages = {
    home: document.getElementById("home"),
    about: document.getElementById("about"),
    music: document.getElementById("music")
};

const navbar = document.getElementById("navbar");
const selector = document.getElementById("pageSelector");
const options = document.querySelectorAll("#pageOptions button");

const fadeTime = 250;
const resizeTime = 350;

let current = pages.home;
let busy = false;


current.classList.add("show");
current.style.opacity = "1";

requestAnimationFrame(function () {

    info.style.height =
        current.scrollHeight + "px";

});


function updateOptions(currentPage) {

    options.forEach(function (option) {

        if (option.dataset.target === currentPage) {
            option.style.display = "none";
        } else {
            option.style.display = "";
        }

    });

}

updateOptions("home");


selector.addEventListener("click", function () {

    if (busy) return;

    navbar.classList.toggle("open");

});


options.forEach(function (option) {

    option.addEventListener("click", function () {

        const pageName =
            this.dataset.target;

        showPage(pageName);

        navbar.classList.remove("open");

    });

});


function showPage(pageName) {

    if (busy) return;

    const next = pages[pageName];

    if (!next || current === next) {
        return;
    }

    busy = true;


    selector.innerHTML =
        `${pageName} <span>▼</span>`;


    updateOptions(pageName);


    current.style.transition =
        `opacity ${fadeTime}ms ease`;

    current.style.opacity = "0";


    setTimeout(function () {

        current.classList.remove("show");


        next.classList.add("show");
        next.style.opacity = "0";


        info.style.height =
            next.scrollHeight + "px";


        setTimeout(function () {

            next.style.transition =
                `opacity ${fadeTime}ms ease`;

            next.style.opacity = "1";


            current = next;
            busy = false;

        }, resizeTime);

    }, fadeTime);

}

/* ──────── END SCRIPT ───────────────────────── */


/* ──────── START DROPDOWN MENU SCRIPT ───────────────────────── */

// dropdown menu lol

$(document).ready(function () {

    $(".about_body").hide();

    $(".about_head").click(function () {

        $(this).next(".about_body").slideToggle("active");

    });

});

/* ──────── END DROPDOWN MENU SCRIPT ─────────────────────────── */