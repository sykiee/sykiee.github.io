/* a lot of this is poached from around the internet and shit,
   but works for my site :) */

   
// makes the cute little clicky sounds

const clickSound = document.getElementById("mouseclick");
document.addEventListener("click", function () {
    clickSound.currentTime = 0;
    clickSound.play();
});

// makes the cute little meow sounds

const mascotImage = document.querySelector(".mascot");
const statusSound = document.getElementById("catSound");

mascotImage.addEventListener("click", () => {
    statusSound.currentTime = 0;
    statusSound.play();
});

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

// inject svgs

function injectSVG(container) {
    const url = container.dataset.svg;
    if (!url) return;

    fetch(url)
        .then(function (response) {
            return response.text();
        })
        .then(function (svgMarkup) {
            container.innerHTML = svgMarkup;
        });
}

document.querySelectorAll("[data-svg]").forEach(injectSVG);

// updates the last updated thingy in footer

const lastUpdated = document.getElementById("last-updated");

if (lastUpdated) {
    const date = new Date();

    lastUpdated.textContent = date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "2-digit"
    }).replace(",", ".").toLowerCase();
}