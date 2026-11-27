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
    "../images/background-3.jpg",
    "../images/background-4.jpg",
    "../images/background-5.jpg",
    "../images/background-6.jpg",
    "../images/background-7.jpg"
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


// status.cafe widget

const statusCafe = document.getElementById("statuscafe");
const statusCafeInner = document.getElementById("statuscafe-inner");
const statusCafeTime = document.getElementById("statuscafe-time");
const statusCafeUrl = "https://status.cafe/users/grasscanons";

function updateStatusCafeMarquee() {
    const text = statusCafeInner.querySelector(".statuscafe-marquee-text");

    if (!text) return;

    statusCafeInner.classList.toggle(
        "marquee",
        text.scrollWidth > statusCafeInner.clientWidth
    );
}

fetch("https://status.cafe/users/grasscanons/status.json")
    .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
    })
    .then(r => {
        statusCafeTime.textContent = r.timeAgo;

        const text = document.createElement("span");
        text.className = "statuscafe-marquee-text";
        text.textContent = r.content || "no status yet.";

        statusCafeInner.replaceChildren(text);

        requestAnimationFrame(updateStatusCafeMarquee);
    })
    .catch(() => {
        statusCafeInner.textContent = "couldn't load status.";
    });

window.addEventListener("resize", updateStatusCafeMarquee);

statusCafe?.addEventListener("click", () => {
    window.CustomConfirm({
        title: "leaving sykiee.me",
        body: "are you sure you want to visit:",
        btn_yes: "yes",
        btn_no: "no",
        has_overlay: true
    }, function (confirmed) {
        if (confirmed) {
            window.open(statusCafeUrl, "_blank", "noopener,noreferrer");
        }
    });

    const dialog = document.querySelector(".c2");
    const body = dialog?.querySelector(".c2_body");

    if (body) {
        body.replaceChildren();

        const message = document.createElement("div");
        message.textContent = "are you sure you want to visit:";

        const link = document.createElement("strong");
        link.textContent = statusCafeUrl;

        body.append(message, link);
    }
});


// blog popup | {https://jasonwatmore.com/post/2023/01/04/vanilla-js-css-modal-popup-dialog-tutorial-with-example}

const blogPage = document.getElementById("blog-page");
const blogOpenButton = document.getElementById("blog-open-button");

function waitForBlogImages() {
    const images = Array.from(blogPage.querySelectorAll("img"));

    return Promise.all(
        images.map(img => {
            img.loading = "eager";

            if (img.complete) {
                return Promise.resolve();
            }

            return new Promise(resolve => {
                img.addEventListener("load", resolve, { once: true });
                img.addEventListener("error", resolve, { once: true });
            });
        })
    );
}

async function openBlog() {
    if (!blogPage) return;

    blogPage.classList.remove("loaded");
    blogPage.classList.add("open");
    document.body.classList.add("blog-open");

    await waitForBlogImages();
    await document.fonts.ready;

    if (!blogPage.classList.contains("open")) return;

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            if (blogPage.classList.contains("open")) {
                blogPage.classList.add("loaded");
            }
        });
    });
}

function closeBlog() {
    if (!blogPage) return;

    blogPage.classList.remove("open", "loaded");
    document.body.classList.remove("blog-open");
}

blogOpenButton?.addEventListener("click", openBlog);

blogPage?.addEventListener("click", event => {
    if (event.target === blogPage) {
        closeBlog();
    }
});

document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || blogImageViewer.classList.contains("open")) return;
    if (blogPage.classList.contains("open")) closeBlog();
});


// blog photo journal | {https://stackoverflow.com/questions/60620498/}

const blogPosts = [
    {
        id: 1,
        date: "2026-11-27",
        images: [
            "images/blog/image-002.jpg",
            "images/blog/image-003.jpg",
            "images/blog/image-004.jpg",
            "images/blog/image-005.jpg",
            "images/blog/image-006.jpg",
            "images/blog/image-007.jpg",
            "images/blog/image-008.jpg",
            "images/blog/image-010.jpg",
            "images/blog/image-011.jpg",
            "images/blog/image-012.jpg",
            "images/blog/image-013.jpg",
            "images/blog/image-014.jpg",
            "images/blog/image-015.jpg",
        ],
        text: "• took a trip to see one of my closest friends in memphis, tennessee this past weekend. got some really good photos there too. it was super fun, but i'm happy to be home :)"
    }
];

const blogDate = document.getElementById("blog-date");
const blogPosted = document.getElementById("blog-posted");
const blogAgo = document.getElementById("blog-ago");
const blogImages = document.getElementById("blog-images");
const blogText = document.getElementById("blog-text");
const blogCounter = document.getElementById("blog-counter");
const blogOlder = document.getElementById("blog-previous");
const blogNewer = document.getElementById("blog-next");

const blogImageViewer = document.getElementById("blog-image-viewer");
const blogExpandedImage = document.getElementById("blog-expanded-image");
const previousImage = document.getElementById("blog-image-previous");
const nextImage = document.getElementById("blog-image-next");

let currentPost = 0;
let currentImage = 0;

function updateBlog() {
    const post = blogPosts[currentPost];
    const date = new Date(post.date);
    const parseDate = value => new Date(`${value}T00:00:00`);

    const formattedDate = date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit"
    });

    const daysAgo = Math.max(0, Math.floor(
        (new Date() - date) / (1000 * 60 * 60 * 24)
    ));

    blogDate.textContent = "[ bruce's journal ]";
    blogPosted.textContent = formattedDate;
    blogAgo.textContent = `(${daysAgo}d ago)`;

    blogImages.replaceChildren();

    post.images.forEach((imagePath, index) => {
        const image = document.createElement("img");

        image.src = imagePath;
        image.className = "blog-gallery-image";
        image.alt = "photo from blog post";
        image.loading = "lazy";
        image.decoding = "async";
        image.dataset.index = index;

        blogImages.appendChild(image);
    });

    blogText.textContent = post.text || "";
    blogCounter.textContent = `${currentPost + 1}/${blogPosts.length}`;

    blogOlder.disabled = currentPost === blogPosts.length - 1;
    blogNewer.disabled = currentPost === 0;

    closeBlogImage();
}

function openBlogImage(index) {
    const images = blogPosts[currentPost].images;

    if (!images.length) return;

    currentImage = index;
    blogExpandedImage.src = images[currentImage];
    blogExpandedImage.alt = `photo ${currentImage + 1} of ${images.length}`;

    const showArrows = images.length > 1;

    previousImage.hidden = !showArrows;
    nextImage.hidden = !showArrows;

    blogImageViewer.classList.add("open");
}

function closeBlogImage() {
    blogImageViewer.classList.remove("open");
    blogExpandedImage.src = "";
}

function changeBlogImage(direction) {
    const images = blogPosts[currentPost].images;

    if (images.length < 2) return;

    currentImage = (
        currentImage + direction + images.length
    ) % images.length;

    blogExpandedImage.src = images[currentImage];
    blogExpandedImage.alt = `photo ${currentImage + 1} of ${images.length}`;
}

blogImages.addEventListener("click", event => {
    const image = event.target.closest(".blog-gallery-image");

    if (!image) return;

    openBlogImage(Number(image.dataset.index));
});

blogExpandedImage.addEventListener("click", closeBlogImage);

blogImageViewer.addEventListener("click", event => {
    if (event.target === blogImageViewer) {
        closeBlogImage();
    }
});

previousImage.addEventListener("click", event => {
    event.stopPropagation();
    changeBlogImage(-1);
});

nextImage.addEventListener("click", event => {
    event.stopPropagation();
    changeBlogImage(1);
});

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

document.addEventListener("keydown", event => {
    if (!blogImageViewer.classList.contains("open")) return;

    if (event.key === "Escape") {
        closeBlogImage();
    } else if (event.key === "ArrowLeft") {
        changeBlogImage(-1);
    } else if (event.key === "ArrowRight") {
        changeBlogImage(1);
    }
});

updateBlog();


// new blog notification | {https://stackoverflow.com/questions/19839860/}

const blogNewTag = document.querySelector(".blog-new-tag");

if (blogNewTag && blogPosts.length > 0) {
    const latestPostDate = new Date(blogPosts[0].date).getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    const postAge = Date.now() - latestPostDate;

    if (postAge >= 0 && postAge < oneDay) {
        blogNewTag.classList.add("show");
    }
}


// external link confirmation (+ custom confirm styling in styles.css)| {https://github.com/darkylmnx/CustomConfirm}

CustomConfirm({
    targets: Array.from(document.querySelectorAll("a[href]")).filter(link => {
        return new URL(link.href, window.location.href).hostname !== window.location.hostname;
    }),
    title: "leaving sykiee.me",
    body: "are you sure you want to visit:",
    btn_yes: "yes",
    btn_no: "no",
    has_overlay: true
}, function (confirmed, targetElement) {
    if (confirmed && targetElement) {
        window.open(targetElement.href, "_blank", "noopener,noreferrer");
    }
});


// footer date update | {https://stackoverflow.com/questions/67745637/}

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