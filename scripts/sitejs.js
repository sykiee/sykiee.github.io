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