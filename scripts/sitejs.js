// makes the cute little clicky sounds
const clickSound = document.getElementById("mouseclick");

document.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();
});

// loading screen
const hideLoadingScreen = () => document.body.classList.add("loaded");

if (document.readyState === "complete") {
    hideLoadingScreen();
} else {
    window.addEventListener("load", hideLoadingScreen);
}

// cute little meow sounds
const mascotImage = document.querySelector(".mascot");
const statusSound = document.getElementById("catSound");

mascotImage.addEventListener("click", () => {
    statusSound.currentTime = 0;
    statusSound.play();
});

// rotate background on refresh
let backgroundNumber = (Number(localStorage.getItem("backgroundNumber")) || 0) % 3 + 1;

localStorage.setItem("backgroundNumber", backgroundNumber);

document.body.style.setProperty(
    "--background-url",
    `url("images/background-${backgroundNumber}.jpg")`
);

// inject svgs
document.querySelectorAll("[data-svg]").forEach(container => {
    const url = container.dataset.svg;
    if (!url) return;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
        })
        .then(svg => container.innerHTML = svg)
        .catch(error => console.error("SVG loading error:", error));
});

// update footer date
const lastUpdated = document.getElementById("last-updated");

if (lastUpdated) {
    lastUpdated.textContent = new Date()
        .toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "2-digit"
        })
        .replace(",", ".")
        .toLowerCase();
}