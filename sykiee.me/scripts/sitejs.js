/* a lot of this is poached from around the internet and shit,
   but works for my site :) */



/* ──────── START CLICK SOUND SCRIPT ────────────────────────────────────── */

const clickSound = document.getElementById("mouseclick");

document.addEventListener("click", function () {

    clickSound.currentTime = 0;
    clickSound.play();

});

/* ──────── END CLICK SOUND SCRIPT ─────────────────────────────────────── */



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



/* ──────── START UPDATE BOX SCRIPT ───────────────────────────────────── */

const updates = document.getElementById("updates");
const updatesHead = updates.querySelector(".updates-head");

updatesHead.addEventListener("click", function () {

    updates.classList.toggle("open");

});

/* ──────── END UPDATE BOX SCRIPT ────────────────────────────────────── */



/* ──────── START CONTAINER WINDOW SCRIPT ────────────────────────────── */

// gay little scroll thingy

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

    navbar.classList.toggle("open");

});


options.forEach(function (option) {

    option.addEventListener("click", function () {

        const pageName = this.dataset.target;
        const target = pages[pageName];

        if (!target) return;


        selector.innerHTML =
            `${pageName} <span>▼</span>`;


        updateOptions(pageName);


        const top =
            target.getBoundingClientRect().top -
            info.getBoundingClientRect().top +
            info.scrollTop;

        info.scrollTo({
            top: top,
            behavior: "smooth"
        });


        navbar.classList.remove("open");

    });

});


/* ──────── END CONTAINER WINDOW SCRIPT ──────────────────────────────── */



/* ──────── START DROPDOWN MENU SCRIPT ───────────────────────────────── */

// dropdown menu lol

$(document).ready(function () {

    $(".about_body").hide();

    $(".about_head").click(function () {

        $(this).next(".about_body").slideToggle("active");

    });

});

/* ──────── END DROPDOWN MENU SCRIPT ────────────────────────────────── */