// poached from around the internet, take what you want :)

// /* credits for all scripts below */


// custom tooltips | {https://manos.malihu.gr/style-my-tooltips-jquery-plugin/}

(function($) {
    $(document).ready(function() {
        $("[title]").style_my_tooltips({
            tip_follows_cursor: true,
            tip_delay_time: 100,
            tip_fade_speed: 200,
            attribute: "title"
        });
    });
})(jQuery);


// loading screen | {https://stackoverflow.com/questions/1853662/}

const loader = document.getElementById("loading-screen");

function hideLoader() {
    if (!loader || loader.classList.contains("hidden")) return;

    setTimeout(() => {
        loader.classList.add("hidden");

        setTimeout(() => {
            document.body.classList.add("loaded");

            setTimeout(() => {
                document.getElementById("navbar")?.classList.add("ready");
            }, 1000);
        }, 800);
    }, 900);
}

window.addEventListener("load", hideLoader, { once: true });
setTimeout(hideLoader, 6000);


// rotate background on refresh {https://stackoverflow.com/questions/55170278/}

const backgrounds = [
    "../images/background-1.jpg",
    "../images/background-2.jpg",
    "../images/background-3.jpg"
];

let lastIndex = Number.parseInt(localStorage.getItem("last_index"));

if (Number.isNaN(lastIndex)) {
    lastIndex = 0;
} else {
    lastIndex++;
}

localStorage.setItem("last_index", lastIndex);

const backgroundIndex = lastIndex % backgrounds.length;

document.body.style.setProperty(
    "--background-url",
    `url("${backgrounds[backgroundIndex]}")`
);

// page navigation | {https://gist.github.com/hellobrian/f99b48ad868afe4d0dbc}

const buttons = {
    home: document.getElementById("home"),
    blog: document.getElementById("blog")
};

const pages = {
    home: document.getElementById("main-page"),
    blog: document.getElementById("blog-page")
};

const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("nav-toggle");

let currentPage = "home";
let switching = false;

navToggle?.addEventListener("click", () => {
    navbar.classList.toggle("open");
});

function switchPage(selected) {
    if (selected === currentPage || switching) return;

    switching = true;

    const oldPage = pages[currentPage];
    const newPage = pages[selected];

    oldPage.classList.remove("visible");

    setTimeout(() => {
        oldPage.hidden = true;
        newPage.hidden = false;

        buttons[currentPage]?.classList.remove("active");
        buttons[selected]?.classList.add("active");

        currentPage = selected;
        navbar.classList.remove("open");

        requestAnimationFrame(() => {
            newPage.classList.add("visible");

            setTimeout(() => {
                switching = false;
            }, 300);
        });
    }, 300);
}

Object.keys(buttons).forEach(name => {
    buttons[name]?.addEventListener("click", () => {
        switchPage(name);
    });
});


// footer date update

fetch("https://api.github.com/repos/sykiee/sykiee.github.io/commits?per_page=1")
    .then(res => res.json())
    .then(res => {
        const date = new Date(res[0].commit.committer.date)
            .toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "2-digit"
            })
            .replace(",", ".")
            .toLowerCase();

        document.getElementById("last-updated").textContent = date;
    })
    .catch(() => {
        document.getElementById("last-updated").textContent = "unknown";
    });