/* a lot of this is poached from around the internet and shit,
   but works for my site :) feel free to take whatever you want*/




/* ──────── START CLICK SOUND SCRIPT ────────────────────────────────────── */

// makes the cute little clicky sounds

const clickSound = document.getElementById("mouseclick");
document.addEventListener("click", function() {
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




/* ──────── START LANDING CHANGE SCRIPT ───────────────────────────────── */

// landing page shit

const landing = document.getElementById("landing");
const logo = document.getElementById("logo");
const main = document.getElementById("main");
const status = document.getElementById("status");

let entered = false;

logo.addEventListener("click", function() {
	if (!entered) {
		entered = true;
		landing.classList.add("hide");
		main.classList.add("show");
		status.classList.add("show");
		logo.classList.add("main-position");

	} else {
		entered = false;
		main.classList.remove("show");
		status.classList.remove("show");
		logo.classList.remove("main-position");
		landing.classList.remove("hide");

	}

});


/* ──────── END LANDING CHANGE SCRIPT ─────────────────────────────────── */




/* ──────── START UPDATE BOX SCRIPT ───────────────────────────────────── */

// cool little update box thingy

const updates = document.getElementById("updates");
const updatesHead = updates.querySelector(".updates-head");

updatesHead.addEventListener("click", function() {
	updates.classList.toggle("open");

});


/* ──────── END UPDATE BOX SCRIPT ────────────────────────────────────── */




/* ──────── START CONTAINER WINDOW SCRIPT ────────────────────────────── */

// gay little scroll thingy for my stupid little interests and stuff

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
	options.forEach(function(option) {
		if (option.dataset.target === currentPage) {
			option.style.display = "none";
		} else {
			option.style.display = "";
		}
	});
}

updateOptions("home");

selector.addEventListener("click", function() {
	navbar.classList.toggle("open");
});

options.forEach(function(option) {
	option.addEventListener("click", function() {

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

$(document).ready(function() {

	$(".about_body").hide();

	$(".about_head").click(function() {

		$(this).next(".about_body").slideToggle("active");

	});

});


/* ──────── END DROPDOWN MENU SCRIPT ────────────────────────────────── */