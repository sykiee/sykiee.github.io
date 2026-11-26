// poached from around the internet, take what you want :)

/* credits for all scripts below */


// custom tooltips | {https://manos.malihu.gr/style-my-tooltips-jquery-plugin/}

(function ($) {
    $(document).ready(function () {
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


// rotate background on refresh | {https://stackoverflow.com/questions/55170278/}

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


// blog popup | {https://jasonwatmore.com/post/2023/01/04/vanilla-js-css-modal-popup-dialog-tutorial-with-example}

function openBlog() {
    document.getElementById("blog-page").classList.add("open");
    document.body.classList.add("blog-open");
}

function closeBlog() {
    document.getElementById("blog-page").classList.remove("open");
    document.body.classList.remove("blog-open");
}

window.addEventListener("load", function () {
    document.getElementById("blog-open-button")?.addEventListener("click", openBlog);

    document.addEventListener("click", event => {
        if (
            document.getElementById("blog-page").classList.contains("open") &&
            event.target === document.getElementById("blog-page")
        ) {
            closeBlog();
        }
    });
});


// blog photo journal

const blogPosts = [
    {
        date: "2026-11-18T02:04:00",
        images: [
            "images/blog/photo-1.jpg"
        ]
    },
    {
        date: "2026-11-18T02:04:00",
        images: [
            "images/blog/photo-1.jpg"
        ]
    }
];

const blogDate = document.getElementById("blog-date");
const blogPosted = document.getElementById("blog-posted");
const blogAgo = document.getElementById("blog-ago");
const blogImages = document.getElementById("blog-images");
const blogCounter = document.getElementById("blog-counter");
const blogOlder = document.getElementById("blog-older");
const blogNewer = document.getElementById("blog-newer");

const blogImageViewer = document.getElementById("blog-image-viewer");
const blogExpandedImage = document.getElementById("blog-expanded-image");

let currentPost = 0;

function updateBlog() {
    const post = blogPosts[currentPost];
    const date = new Date(post.date);

    const formattedDate = date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit"
    });

    const daysAgo = Math.floor(
        (new Date() - date) / (1000 * 60 * 60 * 24)
    );

    blogDate.textContent = "[ bruce's journal ]";
    blogPosted.textContent = formattedDate;
    blogAgo.textContent = `(${daysAgo}d ago)`;

    blogImages.replaceChildren();

    post.images.forEach(imagePath => {
        const image = document.createElement("img");

        image.src = imagePath;
        image.className = "blog-gallery-image";

        blogImages.appendChild(image);
    });

    blogCounter.textContent = `${currentPost + 1}/${blogPosts.length}`;

    blogOlder.disabled = currentPost === blogPosts.length - 1;
    blogNewer.disabled = currentPost === 0;

    closeBlogImage();
}

blogOlder.addEventListener("click", () => {
    if (currentPost < blogPosts.length - 1) {
        currentPost++;
        updateBlog();
    }
});

blogNewer.addEventListener("click", () => {
    if (currentPost > 0) {
        currentPost--;
        updateBlog();
    }
});

blogImages.addEventListener("click", event => {
    if (event.target.classList.contains("blog-gallery-image")) {
        blogExpandedImage.src = event.target.src;
        blogImageViewer.classList.add("open");
    }
});

function closeBlogImage() {
    blogImageViewer.classList.remove("open");
    blogExpandedImage.src = "";
}

blogImageViewer.addEventListener("click", event => {
    if (event.target === blogImageViewer) {
        closeBlogImage();
    }
});

updateBlog();


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