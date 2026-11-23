
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


// discord activity widget

const escapeText = str => String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const userId = "384860738482733057";
const timeZone = "America/Chicago";

const discordCard = document.getElementById("discord-card");
const discordButton = document.getElementById("discord-button");
const avatar = document.getElementById("button-avatar");
const discordDot = document.getElementById("button-dot");
const clock = document.getElementById("button-time");

let presence = null;
let lastSnapshot = "";

const iconCache = new Map();

const discordStatusNames = {
    online: "online",
    idle: "idle",
    dnd: "busy",
    offline: "offline"
};

const activityVerbs = {
    0: "playing",
    1: "streaming",
    3: "watching",
    5: "competing"
};

const getAvatar = user => {
    if (user.avatar) {
        const extension = user.avatar.startsWith("a_") ? "gif" : "png";
        return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=128`;
    }

    return `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(user.id) >> 22n) % 6n)}.png`;
};

const getAppIcon = async id => {
    if (!id) return null;
    if (iconCache.has(id)) return iconCache.get(id);

    const request = (async () => {
        try {
            const response = await fetch(`https://discord.com/api/v10/applications/${id}/rpc`);

            if (!response.ok) return null;

            const app = await response.json();

            return app.icon
                ? `https://cdn.discordapp.com/app-icons/${app.id}/${app.icon}.png`
                : null;
        } catch (error) {
            console.error("Application icon error:", error);
            return null;
        }
    })();

    iconCache.set(id, request);
    return request;
};

const getActivityImage = activity => {
    const image = activity.assets?.large_image || activity.assets?.small_image;

    if (!image) return activity.application_icon || null;

    if (image.startsWith("mp:external/")) {
        return `https://media.discordapp.net/external/${image.slice(12)}`;
    }

    if (image.startsWith("spotify:")) {
        return `https://i.scdn.co/image/${image.slice(8)}`;
    }

    if (image.startsWith("http")) return image;

    if (activity.application_id) {
        return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png`;
    }

    return activity.application_icon || null;
};

const songTime = ms => {
    const seconds = Math.floor(Math.max(0, ms) / 1000);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

const activityTime = ms => {
    const seconds = Math.floor(Math.max(0, ms) / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return hours
        ? `${hours}h ${minutes}m`
        : minutes
            ? `${minutes}m`
            : `${seconds}s`;
};

const showActivity = activity => activity.type !== 2 && activity.type !== 4;

const updateButton = () => {
    if (!discordDot || !avatar) return;

    const status = discordStatusNames[presence?.discord_status] || "offline";

    discordDot.className = `presence-dot status-${status}`;

    if (presence?.discord_user) {
        const image = getAvatar(presence.discord_user);

        if (avatar.getAttribute("src") !== image) {
            avatar.src = image;
        }
    }
};

const activityHTML = activities => {
    if (!activities.length) return `
        <div class="presence-section">
            <div class="presence-section-label">ACTIVITY</div>
            <div class="presence-item">
                <div class="presence-item-info">
                    <div class="presence-item-title">nothing right now</div>
                </div>
            </div>
        </div>`;

    return `
        <div class="presence-section">
            <div class="presence-section-label">ACTIVITY</div>
            ${activities.map(activity => {
                const image = getActivityImage(activity);
                const details = [activity.details, activity.state].filter(Boolean).join(" · ");
                const start = activity.timestamps?.start || 0;
                const verb = activityVerbs[activity.type] || "playing";

                return `
                    <div class="presence-item">
                        <div class="presence-item-image">
                            ${image
                                ? `<img src="${escapeText(image)}">`
                                : `<span>🎮</span>`}
                        </div>
                        <div class="presence-item-info">
                            <div class="presence-item-title">${escapeText(activity.name || "Unknown activity")}</div>
                            ${details
                                ? `<div class="presence-item-subtitle">${escapeText(details)}</div>`
                                : ""}
                            ${start
                                ? `<div class="activity-duration" data-start="${start}" data-verb="${verb}"></div>`
                                : ""}
                        </div>
                    </div>`;
            }).join("")}
        </div>`;
};

const spotifyHTML = spotify => {
    if (!spotify) return `
        <div class="presence-section">
            <div class="presence-section-label spotify-label spotify-inactive">
                <span class="spotify-indicator"></span>
                LISTENING TO
            </div>
            <div class="presence-item">
                <div class="presence-item-info">
                    <div class="presence-item-title">nothing right now</div>
                </div>
            </div>
        </div>`;

    const start = spotify.timestamps?.start || 0;
    const end = spotify.timestamps?.end || 0;

    const spotifyUrl = spotify.track_id
        ? `https://open.spotify.com/track/${spotify.track_id}`
        : null;

    const artists = (spotify.artist || "")
        .split(";")
        .map(name => name.trim())
        .filter(Boolean);

    return `
        <div class="presence-section">
            <div class="presence-section-label spotify-label spotify-active">
                <span class="spotify-indicator"></span>
                LISTENING TO
            </div>
            <div class="presence-item spotify-item">
                <div class="presence-item-image spotify-art" title="${escapeText((spotify.album || spotify.song).toLowerCase())}">
                    ${spotify.album_art_url
                        ? `<img src="${escapeText(spotify.album_art_url)}">`
                        : `<span>🎵</span>`}
                </div>
                <div class="presence-item-info">
                    <div class="presence-item-title">
                        ${spotifyUrl
                            ? `<a class="spotify-song-link" href="${escapeText(spotifyUrl)}" target="_blank" rel="noopener noreferrer">${escapeText(spotify.song)}</a>`
                            : escapeText(spotify.song)}
                    </div>
                    <div class="presence-item-subtitle">
                        ${spotifyUrl
                            ? artists.map(name => `
                                <a class="spotify-artist-link" href="https://open.spotify.com/search/${encodeURIComponent(name)}" target="_blank" rel="noopener noreferrer">${escapeText(name)}</a>
                            `).join(", ")
                            : escapeText(artists.join(", "))}
                    </div>
                    <div class="spotify-now-playing">NOW PLAYING</div>
                </div>
            </div>
            ${start && end && end > start ? `
                <div class="spotify-progress" data-start="${start}" data-end="${end}">
                    <div class="spotify-progress-track">
                        <div class="spotify-progress-fill"></div>
                    </div>
                    <div class="spotify-progress-times">
                        <span class="spotify-elapsed">0:00</span>
                        <span class="spotify-duration">0:00</span>
                    </div>
                </div>` : ""}
        </div>`;
};

const updateCard = () => {
    if (!discordCard) return;

    if (!presence?.discord_user) {
        discordCard.innerHTML = `
            <div class="presence-empty">discord status unavailable</div>
            ${activityHTML([])}
            ${spotifyHTML(null)}`;
        return;
    }

    const user = presence.discord_user;
    const status = discordStatusNames[presence.discord_status] || "offline";
    const name = user.global_name || user.username;
    const activities = (presence.activities || []).filter(showActivity);

    discordCard.innerHTML = `
        <div class="presence-compact">
            <div class="presence-profile">
                <div class="presence-profile-avatar">
                    <img src="${escapeText(getAvatar(user))}">
                    <span class="presence-dot status-${status}"></span>
                </div>
                <div class="presence-profile-info">
                    <div class="presence-name">${escapeText(name)}</div>
                    <div class="presence-tag" title="friend me on discord :)">@${escapeText(user.username)}</div>
                    <div class="presence-status status-text-${status}">${escapeText(status)}</div>
                </div>
            </div>
            ${activityHTML(activities)}
            ${spotifyHTML(presence.spotify)}
        </div>`;

    updateTimers();
    updateProgress();
};

const cardIsOpen = () => discordCard?.classList.contains("open");

const updateTimers = () => {
    if (!cardIsOpen()) return;

    discordCard.querySelectorAll(".activity-duration").forEach(timer => {
        const start = Number(timer.dataset.start);

        if (start) {
            timer.textContent = `${timer.dataset.verb} for ${activityTime(Date.now() - start)}`;
        }
    });
}

const updateProgress = () => {
    if (!cardIsOpen()) return;

    const progress = discordCard.querySelector(".spotify-progress");
    if (!progress) return;

    const start = Number(progress.dataset.start);
    const end = Number(progress.dataset.end);

    if (!start || !end || end <= start) return;

    const duration = end - start;
    const elapsed = Math.max(0, Math.min(Date.now() - start, duration));

    const fill = progress.querySelector(".spotify-progress-fill");
    const elapsedText = progress.querySelector(".spotify-elapsed");
    const durationText = progress.querySelector(".spotify-duration");

    if (!fill || !elapsedText || !durationText) return;

    fill.style.width = `${elapsed / duration * 100}%`;
    elapsedText.textContent = songTime(elapsed);
    durationText.textContent = songTime(duration);
};

const updateClock = () => {
    if (!clock) return;

    clock.textContent = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone
    });
};

const getPresence = async () => {
    if (document.hidden) return;

    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);

        if (!response.ok) {
            throw new Error("Unable to fetch Discord presence");
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error("Lanyard returned an unsuccessful response");
        }

        presence = data.data;

        await Promise.all((presence.activities || [])
            .filter(showActivity)
            .map(async activity => {
                activity.application_icon = await getAppIcon(activity.application_id);
            }));

        const newSnapshot = JSON.stringify([
            presence.discord_status,
            presence.discord_user,
            presence.activities,
            presence.spotify
        ]);

        if (newSnapshot !== lastSnapshot) {
            lastSnapshot = newSnapshot;
            updateButton();
            updateCard();
        }
    } catch (error) {
        console.error("Discord presence error:", error);

        if (!presence) {
            lastSnapshot = "";
            updateButton();
            updateCard();
        }
    }
};

const toggleCard = open => {
    if (!discordCard || !discordButton) return;

    discordCard.classList.toggle("open", open);

    if (open) {
        updateTimers();
        updateProgress();
    }
};

if (discordButton && discordCard) {
    discordButton.addEventListener("click", () => {
        toggleCard(!cardIsOpen());
    });

    document.addEventListener("click", event => {
        if (!event.target.closest("#discord-presence")) {
            toggleCard(false);
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            toggleCard(false);
        }
    });
}

updateClock();
getPresence();

setInterval(() => {
    updateClock();
    updateTimers();
    updateProgress();
}, 1000);

setInterval(getPresence, 30000);

document.addEventListener("visibilitychange", () => {
    if (!document.hidden) getPresence();
});


// status.cafe

const cafeTime = document.getElementById("statuscafe-time");
const cafeText = document.getElementById("statuscafe-inner");

fetch("https://status.cafe/users/grasscanons/status.json")
    .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (cafeTime) cafeTime.textContent = data.timeAgo;
        if (cafeText) cafeText.textContent = data.content || "no status yet.";
    })
    .catch(() => {
        if (cafeText) cafeText.textContent = "couldn't load status.";
    });


// page navigation

const homePage = document.getElementById("main-page");
const journalPage = document.getElementById("blog-page");
const bookmarksPage = document.getElementById("bookmarks-page");

const homeButton = document.getElementById("home");
const journalButton = document.getElementById("journal");
const bookmarksButton = document.getElementById("bookmarks");

const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("nav-toggle");

navToggle?.addEventListener("click", () => {
    navbar.classList.toggle("open");
});

let currentPage = homePage;
let changingPage = false;

const fadeDuration = 300;

const pages = [
    { page: homePage, button: homeButton },
    { page: journalPage, button: journalButton },
    { page: bookmarksPage, button: bookmarksButton }
];

const switchPage = nextPage => {
    if (changingPage || !nextPage || nextPage === currentPage) return;

    changingPage = true;

    const oldPage = currentPage;

    oldPage.classList.remove("visible");

    setTimeout(() => {
        oldPage.style.display = "none";
        nextPage.style.display = nextPage === homePage ? "" : "flex";
        nextPage.scrollTop = 0;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                nextPage.classList.add("visible");

                currentPage = nextPage;

                pages.forEach(({ page, button }) => {
                    button?.classList.toggle("active", page === currentPage);
                });

                setTimeout(() => {
                    changingPage = false;
                }, fadeDuration);
            });
        });
    }, fadeDuration);
};

homeButton?.addEventListener("click", () => switchPage(homePage));
journalButton?.addEventListener("click", () => switchPage(journalPage));
bookmarksButton?.addEventListener("click", () => switchPage(bookmarksPage));


// custom tooltips

const tooltip = document.createElement("div");
tooltip.id = "custom-tooltip";
document.body.appendChild(tooltip);

let hoveredElement = null;
let tooltipTimer = null;
let mouseX = 0;
let mouseY = 0;

function moveTooltip() {
    if (!hoveredElement) return;

    const gap = 11;

    tooltip.style.left = "0px";
    tooltip.style.top = "0px";

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

    if (hoveredElement?.dataset.customTooltipTitle !== undefined) {
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

    mouseX = event.clientX;
    mouseY = event.clientY;
    hoveredElement = element;

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
    if (!hoveredElement || !hoveredElement.contains(event.target)) return;
    if (event.relatedTarget && hoveredElement.contains(event.relatedTarget)) return;

    hideTooltip();
});

document.addEventListener("mousedown", hideTooltip);
document.addEventListener("scroll", hideTooltip, true);
window.addEventListener("blur", hideTooltip);


// footer date

const footerDate = document.getElementById("last-updated");

if (footerDate) {
    const savedDate = sessionStorage.getItem("lastUpdated");

    if (savedDate) {
        footerDate.textContent = savedDate;
    } else {
        fetch("https://api.github.com/repos/sykiee/sykiee.github.io/commits?per_page=1")
            .then(response => {
                if (!response.ok) throw new Error("GitHub API error");
                return response.json();
            })
            .then(commits => {
                if (!commits.length) throw new Error("No commits found");

                const formattedDate = new Date(commits[0].commit.committer.date)
                    .toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "2-digit"
                    })
                    .replace(",", ".")
                    .toLowerCase();

                sessionStorage.setItem("lastUpdated", formattedDate);
                footerDate.textContent = formattedDate;
            })
            .catch(() => {
                footerDate.textContent = "unknown";
            });
    }
}
