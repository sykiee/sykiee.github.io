// poached from around the internet, take what you want :)


// loading screen

const loader = document.getElementById("loading-screen");
const loadStart = performance.now();
let loaded = false;

function hideLoader() {
    if (loaded) return;
    loaded = true;

    const delay = Math.max(0, 900 - (performance.now() - loadStart));

    setTimeout(() => {
        loader.classList.add("hidden");

        setTimeout(() => {
            document.body.classList.add("loaded");

            setTimeout(() => {
                document.getElementById("navbar")?.classList.add("ready");
            }, 1000);
        }, 800);
    }, delay);
}

window.addEventListener("load", hideLoader, { once: true });
setTimeout(hideLoader, 6000);


// rotate background on refresh

let background = (Number(localStorage.getItem("backgroundNumber")) || 0) % 3 + 1;
localStorage.setItem("backgroundNumber", background);

document.body.style.setProperty(
    "--background-url",
    `url("../images/background-${background}.jpg")`
);


// page navigation

const pages = {
    home: document.getElementById("main-page"),
    blog: document.getElementById("blog-page")
};

const buttons = {
    home: document.getElementById("home"),
    blog: document.getElementById("blog")
};

const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("nav-toggle");

let currentPage = "home";
let navigationTimer;

navToggle?.addEventListener("click", () => {
    navbar.classList.toggle("open");
});

Object.keys(pages).forEach(name => {
    buttons[name]?.addEventListener("click", () => {
        if (name === currentPage) return;

        clearTimeout(navigationTimer);

        const oldPage = pages[currentPage];
        const nextPage = pages[name];

        oldPage.classList.remove("visible");

        navigationTimer = setTimeout(() => {
            oldPage.hidden = true;
            nextPage.hidden = false;
            nextPage.scrollTop = 0;

            requestAnimationFrame(() => {
                nextPage.classList.add("visible");
            });

            buttons[currentPage]?.classList.remove("active");
            buttons[name]?.classList.add("active");

            currentPage = name;
        }, 300);
    });
});


// footer date

const footerDate = document.getElementById("last-updated");

if (footerDate) {
    const savedDate = sessionStorage.getItem("lastUpdated");

    if (savedDate) {
        footerDate.textContent = savedDate;
    } else {
        fetch("https://api.github.com/repos/sykiee/sykiee.github.io/commits?per_page=1")
            .then(response => {
                if (!response.ok) throw new Error();
                return response.json();
            })
            .then(commits => {
                const date = new Date(commits[0].commit.committer.date)
                    .toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "2-digit"
                    })
                    .replace(",", ".")
                    .toLowerCase();

                sessionStorage.setItem("lastUpdated", date);
                footerDate.textContent = date;
            })
            .catch(() => footerDate.textContent = "unknown");
    }
}


// custom tooltips

const tooltip = document.createElement("div");
tooltip.id = "custom-tooltip";
document.body.appendChild(tooltip);

let hoveredElement = null;
let tooltipTimer;
let mouseX = 0;
let mouseY = 0;

function moveTooltip() {
    const gap = 11;
    const rect = tooltip.getBoundingClientRect();

    let x = mouseX + gap;
    let y = mouseY + gap;

    if (x + rect.width > window.innerWidth - 8) {
        x = mouseX - rect.width - gap;
    }

    if (y + rect.height > window.innerHeight - 8) {
        y = mouseY - rect.height - gap;
    }

    tooltip.style.left = `${Math.max(8, Math.min(x, window.innerWidth - rect.width - 8))}px`;
    tooltip.style.top = `${Math.max(8, Math.min(y, window.innerHeight - rect.height - 8))}px`;
}

function hideTooltip() {
    clearTimeout(tooltipTimer);

    if (hoveredElement) {
        hoveredElement.setAttribute("title", hoveredElement.dataset.customTooltipTitle);
        delete hoveredElement.dataset.customTooltipTitle;
    }

    hoveredElement = null;
    tooltip.classList.remove("visible");
}

document.addEventListener("mouseover", event => {
    const element = event.target.closest("[title]");

    if (!element || element === hoveredElement) return;

    hideTooltip();

    const title = element.getAttribute("title");
    if (!title) return;

    element.dataset.customTooltipTitle = title;
    element.removeAttribute("title");

    hoveredElement = element;
    mouseX = event.clientX;
    mouseY = event.clientY;

    tooltipTimer = setTimeout(() => {
        if (!hoveredElement?.isConnected) return;

        tooltip.textContent = title;
        tooltip.classList.add("visible");
        moveTooltip();
    }, 100);
});

document.addEventListener("mousemove", event => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (hoveredElement && tooltip.classList.contains("visible")) {
        moveTooltip();
    }
});

document.addEventListener("mouseout", event => {
    if (hoveredElement?.contains(event.target) &&
        !hoveredElement.contains(event.relatedTarget)) {
        hideTooltip();
    }
});

document.addEventListener("mousedown", hideTooltip);
document.addEventListener("scroll", hideTooltip, true);
window.addEventListener("blur", hideTooltip);