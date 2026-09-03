/* a lot of this is poached from around the internet and shit,
   but works for my site :) */



/* ──────── START CLICK SOUND SCRIPT ────────────────────────────────────── */

// makes the cute little clicky sounds

const clickSound = document.getElementById("mouseclick");
document.addEventListener("click", function () {
    clickSound.currentTime = 0;
    clickSound.play();
});


/* ──────── END CLICK SOUND SCRIPT ─────────────────────────────────────── */



/* ──────── START BACKGROUND CHANGE SCRIPT ─────────────────────────────── */

// change background on site refresh

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

const info = document.getElementById("page-container");

const pages = {
    home: document.getElementById("home"),
    about: document.getElementById("info")
};

const sections = {
    "section-about": document.getElementById("section-about"),
    "section-interests": document.getElementById("section-interests"),
    "section-music": document.getElementById("section-music")
};

const header = document.getElementById("logo");
const navbar = document.getElementById("navbar");
const selector = document.getElementById("pageSelector");
const options = document.querySelectorAll("#pageOptions button");
const aboutScroll = document.getElementById("infoScroll");

const fadeTime = 250;
const resizeTime = 350;

const ABOUT_HEIGHT =
    (19.6 * parseFloat(getComputedStyle(document.documentElement).fontSize)) +
    (parseFloat(getComputedStyle(info).paddingTop) * 2);

let current = pages.home;
let currentSection = "section-about";
let busy = false;


current.classList.add("show");
current.style.opacity = "1";
info.style.height = info.scrollHeight + "px";


function updateOptions(currentTarget) {
    options.forEach(function (option) {
        if (option.dataset.target === currentTarget) {
            option.style.display = "none";
        } else {
            option.style.display = "";
        }
    });
}

updateOptions(currentSection);


header.addEventListener("click", function () {
    const nextPage = current === pages.home ? "about" : "home";
    showPage(nextPage);
});


selector.addEventListener("click", function () {
    navbar.classList.toggle("open");
});


options.forEach(function (option) {

    option.addEventListener("click", function () {

        const sectionName = this.dataset.target;
        const target = sections[sectionName];
        if (!target) return;

        function scrollToSection() {

            const top =
                target.getBoundingClientRect().top -
                aboutScroll.getBoundingClientRect().top +
                aboutScroll.scrollTop;

            aboutScroll.scrollTo({
                top: top,
                behavior: "smooth"
            });

            selector.innerHTML =
                `${sectionName.replace("section-", "")} <span>▼</span>`;

            updateOptions(sectionName);
            currentSection = sectionName;

        }

        navbar.classList.remove("open");

        if (current !== pages.about) {
            showPage("about");
            setTimeout(scrollToSection, fadeTime + resizeTime);
        } else {
            scrollToSection();
        }

    });

});


function showPage(pageName) {

    if (busy) return;

    const next = pages[pageName];

    if (!next || current === next) {
        return;
    }

    busy = true;

    info.style.height = info.getBoundingClientRect().height + "px";

    current.style.transition = `opacity ${fadeTime}ms ease`;
    current.style.opacity = "0";

    if (pageName !== "about") {
        navbar.classList.remove("show");
    }

    setTimeout(function () {

        current.classList.remove("show");

        next.classList.add("show");
        next.style.opacity = "0";

        if (pageName === "about") {
            info.classList.remove("scrollable");
        }

        const targetHeight =
            pageName === "about" ? ABOUT_HEIGHT : next.scrollHeight;

        requestAnimationFrame(function () {
            info.style.height = targetHeight + "px";
            header.classList.toggle("info-position", pageName === "about");
            if (pageName === "about") {
                info.classList.add("scrollable");
            }
        });

        setTimeout(function () {

            next.style.transition = `opacity ${fadeTime}ms ease`;
            next.style.opacity = "1";

            current = next;
            busy = false;

            if (pageName === "about") {
                navbar.classList.add("show");
            }

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