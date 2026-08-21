/* a lot of this is poached from around the internet and shit, but works for my site :) */

/* ──────── START CONTENT FADE IN SCRIPT ──────────────────────────────────────────── */

// fade in the page after it loads

window.addEventListener("load", function () {
    document.getElementById("content").classList.add("loaded");
});

/* ──────── END SCRIPT ──────────────────────────────────────────── */


/* ──────── START BACKGROUND CHANGE ON REFRESH SCRIPT ──────────────────────────────────────────── */

// change background image every time the site is opened

let backgroundNumber = parseInt(
    localStorage.getItem("backgroundNumber")
) || 0;

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

/* END SCRIPT */


/* ──────── START CONTAINER WINDOW SCRIPT ──────────────────────────────────────────── */

// page selector

const info = document.getElementById("info");

const pages = {
    home: document.getElementById("home"),
    about: document.getElementById("about"),
    interests: document.getElementById("interests"),
    music: document.getElementById("music")
};

const navbar = document.getElementById("navbar");
const selector = document.getElementById("pageSelector");
const options = document.querySelectorAll("#pageOptions button");

const fadeTime = 250;
const resizeTime = 350;

let current = pages.home;
let busy = false;


// show home when the site loads

current.classList.add("show");
current.style.opacity = "1";

requestAnimationFrame(() => {
    info.style.height = current.scrollHeight + "px";
});


// hide the current page from the selector

function updateOptions(currentPage) {

    options.forEach(option => {

        if (option.dataset.target === currentPage) {
            option.style.display = "none";
        } else {
            option.style.display = "";
        }

    });

}

updateOptions("home");


// open and close selector

selector.addEventListener("click", function () {

    if (busy) return;

    navbar.classList.toggle("open");

});


// select a page

options.forEach(option => {

    option.addEventListener("click", function () {

        const pageName = this.dataset.target;

        showPage(pageName);

        navbar.classList.remove("open");

    });

});


// change page

function showPage(pageName) {

    if (busy) return;

    const next = pages[pageName];

    if (!next) return;
    if (current === next) return;

    busy = true;


    // change selector text

    selector.innerHTML =
        `${pageName} <span>▼</span>`;


    // update selector options

    updateOptions(pageName);


    // fade out current page

    current.style.transition =
        `opacity ${fadeTime}ms ease`;

    current.style.opacity = "0";


    setTimeout(() => {

        // hide old page

        current.classList.remove("show");


        // show new page

        next.classList.add("show");
        next.style.opacity = "0";


        // resize info box

        info.style.height =
            next.scrollHeight + "px";


        // fade in new page

        setTimeout(() => {

            next.style.transition =
                `opacity ${fadeTime}ms ease`;

            next.style.opacity = "1";


            current = next;
            busy = false;

        }, resizeTime);

    }, fadeTime);

}

/* ──────── END SCRIPT ──────────────────────────────────────────── */


/* ──────── START MOVEABLE ELEMENTS SCRIPT ──────────────────────────────────────────── */

$(function () {

    $("#status").draggable({
        containment: "window"
    });

});

/* ──────── END SCRIPT ──────────────────────────────────────────── */