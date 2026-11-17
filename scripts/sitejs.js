// loading screen

const loadingScreen = document.getElementById("loading-screen");
const loadingStartedAt = performance.now();
let loadingFinished = false;

function finishLoading() {
    if (loadingFinished) return;
    loadingFinished = true;

    const remaining = Math.max(0, 900 - (performance.now() - loadingStartedAt));

    setTimeout(() => {
        loadingScreen.classList.add("hidden");

        setTimeout(() => {
            document.body.classList.add("loaded");
        }, 800);
    }, remaining);
}

window.addEventListener("load", finishLoading, { once: true });
setTimeout(finishLoading, 6000);


// rotate background on refresh

let backgroundNumber = (Number(localStorage.getItem("backgroundNumber")) || 0) % 3 + 1;
localStorage.setItem("backgroundNumber", backgroundNumber);
document.body.style.setProperty("--background-url", `url("../images/background-${backgroundNumber}.jpg")`);


// discord presence widget

const escapeHTML = str => String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const DISCORD_ID = "384860738482733057";
const TIMEZONE = "America/Chicago";

const PRESENCE_CARD = document.getElementById("presence-card");
const PRESENCE_PILL = document.getElementById("presence-pill");
const PILL_AVATAR = document.getElementById("pill-avatar");
const PILL_DOT = document.getElementById("pill-dot");
const PILL_TIME = document.getElementById("pill-time");

let presence = null;
let lastPresenceKey = "";
const applicationIconCache = new Map();

const STATUS_LABELS = { online: "online", idle: "idle", dnd: "busy", offline: "offline" };
const ACTIVITY_VERBS = { 0: "playing", 1: "streaming", 3: "watching", 5: "competing" };

const avatarUrl = user => {
    if (user.avatar) {
        const extension = user.avatar.startsWith("a_") ? "gif" : "png";
        return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=128`;
    }
    return `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(user.id) >> 22n) % 6n)}.png`;
};

const getApplicationIcon = async applicationId => {
    if (!applicationId) return null;
    if (applicationIconCache.has(applicationId)) return applicationIconCache.get(applicationId);

    const request = (async () => {
        try {
            const response = await fetch(`https://discord.com/api/v10/applications/${applicationId}/rpc`);
            if (!response.ok) return null;

            const application = await response.json();
            return application.icon
                ? `https://cdn.discordapp.com/app-icons/${application.id}/${application.icon}.png`
                : null;
        } catch (error) {
            console.error("Application icon error:", error);
            return null;
        }
    })();

    applicationIconCache.set(applicationId, request);
    return request;
};

const activityImageUrl = activity => {
    const image = activity.assets?.large_image || activity.assets?.small_image;
    if (!image) return activity.application_icon || null;
    if (image.startsWith("mp:external/")) return `https://media.discordapp.net/external/${image.slice(12)}`;
    if (image.startsWith("spotify:")) return `https://i.scdn.co/image/${image.slice(8)}`;
    if (image.startsWith("http")) return image;
    if (activity.application_id) return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png`;
    return activity.application_icon || null;
};

const formatSongTime = ms => {
    const seconds = Math.floor(Math.max(0, ms) / 1000);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

const formatActivityTime = ms => {
    const seconds = Math.floor(Math.max(0, ms) / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours ? `${hours}h ${minutes}m` : minutes ? `${minutes}m` : `${seconds}s`;
};

const isVisibleActivity = activity => activity.type !== 2 && activity.type !== 4;

const renderPill = () => {
    if (!PILL_DOT || !PILL_AVATAR) return;

    const status = presence ? STATUS_LABELS[presence.discord_status] || "offline" : "offline";
    PILL_DOT.className = `presence-dot status-${status}`;
    PILL_DOT.setAttribute("aria-label", status);

    if (presence?.discord_user) {
        const url = avatarUrl(presence.discord_user);
        if (PILL_AVATAR.getAttribute("src") !== url) PILL_AVATAR.src = url;
    }
};

const renderActivity = activities => {
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
        const activityImage = activityImageUrl(activity);
        const details = [activity.details, activity.state].filter(Boolean).join(" · ");
        const start = activity.timestamps?.start || 0;
        const verb = ACTIVITY_VERBS[activity.type] || "playing";

        return `
                    <div class="presence-item">
                        <div class="presence-item-image">
                            ${activityImage ? `<img src="${escapeHTML(activityImage)}" alt="">` : `<span>🎮</span>`}
                        </div>
                        <div class="presence-item-info">
                            <div class="presence-item-title">${escapeHTML(activity.name || "Unknown activity")}</div>
                            ${details ? `<div class="presence-item-subtitle">${escapeHTML(details)}</div>` : ""}
                            ${start ? `<div class="activity-duration" data-start="${start}" data-verb="${verb}"></div>` : ""}
                        </div>
                    </div>`;
    }).join("")}
        </div>`;
};

const renderSpotify = spotify => {
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

    const artists = (spotify.artist || "").split(";").map(name => name.trim()).filter(Boolean);

    return `
        <div class="presence-section">
            <div class="presence-section-label spotify-label spotify-active">
                <span class="spotify-indicator"></span>
                LISTENING TO
            </div>
            <div class="presence-item spotify-item">
                <div class="presence-item-image spotify-art" title="${escapeHTML((spotify.album || spotify.song).toLowerCase())}">
                    ${spotify.album_art_url ? `<img src="${escapeHTML(spotify.album_art_url)}" alt="">` : `<span>🎵</span>`}
                </div>
                <div class="presence-item-info">
                    <div class="presence-item-title">
                        ${spotifyUrl
            ? `<a class="spotify-song-link" href="${escapeHTML(spotifyUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(spotify.song)}</a>`
            : escapeHTML(spotify.song)}
                    </div>
                    <div class="presence-item-subtitle">
                        ${spotifyUrl
            ? artists.map(name => `<a class="spotify-artist-link" href="https://open.spotify.com/search/${encodeURIComponent(name)}" target="_blank" rel="noopener noreferrer">${escapeHTML(name)}</a>`).join(", ")
            : escapeHTML(artists.join(", "))}
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

const renderPresence = () => {
    if (!PRESENCE_CARD) return;

    if (!presence?.discord_user) {
        PRESENCE_CARD.innerHTML = `
            <div class="presence-empty">discord status unavailable</div>
            ${renderActivity([])}
            ${renderSpotify(null)}`;
        return;
    }

    const user = presence.discord_user;
    const status = STATUS_LABELS[presence.discord_status] || "offline";
    const displayName = user.global_name || user.username;
    const activities = (presence.activities || []).filter(isVisibleActivity);

    PRESENCE_CARD.innerHTML = `
        <div class="presence-compact">
            <div class="presence-profile">
                <div class="presence-profile-avatar">
                    <img src="${escapeHTML(avatarUrl(user))}" alt="">
                    <span class="presence-dot status-${status}"></span>
                </div>
                <div class="presence-profile-info">
                    <div class="presence-name">${escapeHTML(displayName)}</div>
                    <div class="presence-tag" title="friend me on discord :)">@${escapeHTML(user.username)}</div>
                    <div class="presence-status status-text-${status}">${escapeHTML(status)}</div>
                </div>
            </div>
            ${renderActivity(activities)}
            ${renderSpotify(presence.spotify)}
        </div>`;

    updateActivityDuration();
    updateSpotifyProgress();
};

const cardIsOpen = () => PRESENCE_CARD?.classList.contains("open");

const updateActivityDuration = () => {
    if (!cardIsOpen()) return;

    PRESENCE_CARD.querySelectorAll(".activity-duration").forEach(duration => {
        const start = Number(duration.dataset.start);
        if (start) duration.textContent = `${duration.dataset.verb} for ${formatActivityTime(Date.now() - start)}`;
    });
};

const updateSpotifyProgress = () => {
    if (!cardIsOpen()) return;

    const progress = PRESENCE_CARD.querySelector(".spotify-progress");
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
    elapsedText.textContent = formatSongTime(elapsed);
    durationText.textContent = formatSongTime(duration);
};

const updateClock = () => {
    if (PILL_TIME) PILL_TIME.textContent = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit", minute: "2-digit", timeZone: TIMEZONE
    });
};

const updateDiscordStatus = async () => {
    if (document.hidden) return;

    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        if (!response.ok) throw new Error("Unable to fetch Discord presence");

        const data = await response.json();
        if (!data.success) throw new Error("Lanyard returned an unsuccessful response");

        presence = data.data;

        await Promise.all((presence.activities || []).filter(isVisibleActivity).map(async activity => {
            activity.application_icon = await getApplicationIcon(activity.application_id);
        }));

        const key = JSON.stringify([presence.discord_status, presence.discord_user, presence.activities, presence.spotify]);

        if (key !== lastPresenceKey) {
            lastPresenceKey = key;
            renderPill();
            renderPresence();
        }
    } catch (error) {
        console.error("Discord presence error:", error);
        if (!presence) {
            lastPresenceKey = "";
            renderPill();
            renderPresence();
        }
    }
};

const setPresenceOpen = open => {
    if (!PRESENCE_CARD || !PRESENCE_PILL) return;

    PRESENCE_CARD.classList.toggle("open", open);
    PRESENCE_PILL.setAttribute("aria-expanded", String(open));

    if (open) {
        updateActivityDuration();
        updateSpotifyProgress();
    }
};

if (PRESENCE_PILL && PRESENCE_CARD) {
    PRESENCE_PILL.addEventListener("click", () => setPresenceOpen(!cardIsOpen()));

    document.addEventListener("click", event => {
        if (!event.target.closest("#presence")) setPresenceOpen(false);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") setPresenceOpen(false);
    });
}

updateClock();
updateDiscordStatus();

setInterval(() => {
    updateClock();
    updateActivityDuration();
    updateSpotifyProgress();
}, 1000);

setInterval(updateDiscordStatus, 30000);
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateDiscordStatus();
});


// status.cafe widget

fetch("https://status.cafe/users/grasscanons/status.json")
    .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
    })
    .then(r => {
        document.getElementById("statuscafe-time").textContent = r.timeAgo;
        document.getElementById("statuscafe-content").textContent = r.content || "no status yet.";
    })
    .catch(() => {
        document.getElementById("statuscafe-content").textContent = "couldn't load status.";
    });


// blog page navigation

const blogButton = document.getElementById("blog");
const blogPage = document.getElementById("blog-page");
const blogBack = document.getElementById("blog-back-button");
const mainPage = document.getElementById("main-page");

let pageTransitioning = false;

const transitionDuration = 300;

const openBlog = () => {
    if (pageTransitioning) return;
    pageTransitioning = true;

    mainPage.classList.add("fade-out");

    setTimeout(() => {
        mainPage.style.display = "none";
        blogPage.style.display = "flex";
        blogBack?.focus({ preventScroll: true });

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                blogPage.classList.add("visible");

                setTimeout(() => {
                    pageTransitioning = false;
                    window.scrollTo(0, 0);
                }, transitionDuration);
            });
        });
    }, transitionDuration);
};

const closeBlog = () => {
    if (pageTransitioning) return;
    pageTransitioning = true;

    blogPage.classList.remove("visible");

    setTimeout(() => {
        blogPage.style.display = "none";
        mainPage.style.display = "";
        blogButton?.focus({ preventScroll: true });

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                mainPage.classList.remove("fade-out");

                setTimeout(() => {
                    pageTransitioning = false;
                    window.scrollTo(0, 0);
                }, transitionDuration);
            });
        });
    }, transitionDuration);
};

blogButton?.addEventListener("click", openBlog);
blogBack?.addEventListener("click", closeBlog);


// custom tooltips script

const customTooltip = document.createElement("div");
customTooltip.id = "custom-tooltip";
customTooltip.setAttribute("role", "tooltip");
document.body.appendChild(customTooltip);

let tooltipTarget = null;
let tooltipTimer = null;
let mouseX = 0;
let mouseY = 0;

function positionCustomTooltip() {
    if (!tooltipTarget) return;

    const gap = 11;
    customTooltip.style.left = "0px";
    customTooltip.style.top = "0px";

    const rect = customTooltip.getBoundingClientRect();
    let x = mouseX + gap;
    let y = mouseY + gap;

    if (x + rect.width > window.innerWidth - 8) x = mouseX - rect.width - gap;
    if (y + rect.height > window.innerHeight - 8) y = mouseY - rect.height - gap;

    customTooltip.style.left = `${Math.max(8, Math.min(x, window.innerWidth - rect.width - 8))}px`;
    customTooltip.style.top = `${Math.max(8, Math.min(y, window.innerHeight - rect.height - 8))}px`;
}

function hideCustomTooltip() {
    clearTimeout(tooltipTimer);

    if (tooltipTarget?.dataset.customTooltipTitle !== undefined) {
        tooltipTarget.setAttribute("title", tooltipTarget.dataset.customTooltipTitle);
        delete tooltipTarget.dataset.customTooltipTitle;
    }

    tooltipTarget = null;
    customTooltip.classList.remove("visible");
}

document.addEventListener("mouseover", event => {
    const element = event.target.closest("[title]");
    if (!element || element === tooltipTarget) return;

    hideCustomTooltip();

    const title = element.getAttribute("title");
    if (!title) return;

    element.dataset.customTooltipTitle = title;
    element.removeAttribute("title");
    mouseX = event.clientX;
    mouseY = event.clientY;
    tooltipTarget = element;

    tooltipTimer = setTimeout(() => {
        if (!tooltipTarget?.isConnected) return;
        customTooltip.textContent = title;
        customTooltip.classList.add("visible");
        positionCustomTooltip();
    }, 100);
});

document.addEventListener("mousemove", event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    if (tooltipTarget && customTooltip.classList.contains("visible")) positionCustomTooltip();
});

document.addEventListener("mouseout", event => {
    if (!tooltipTarget || !tooltipTarget.contains(event.target)) return;
    if (event.relatedTarget && tooltipTarget.contains(event.relatedTarget)) return;
    hideCustomTooltip();
});

document.addEventListener("mousedown", hideCustomTooltip);
document.addEventListener("scroll", hideCustomTooltip, true);
window.addEventListener("blur", hideCustomTooltip);


// update footer date

const lastUpdated = document.getElementById("last-updated");

if (lastUpdated) {
    const cachedDate = sessionStorage.getItem("lastUpdated");

    if (cachedDate) {
        lastUpdated.textContent = cachedDate;
    } else {
        fetch("https://api.github.com/repos/sykiee/sykiee.github.io/commits?per_page=1")
            .then(response => {
                if (!response.ok) throw new Error("GitHub API error");
                return response.json();
            })
            .then(commits => {
                if (!commits.length) throw new Error("No commits found");

                const formatted = new Date(commits[0].commit.committer.date)
                    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "2-digit" })
                    .replace(",", ".").toLowerCase();

                sessionStorage.setItem("lastUpdated", formatted);
                lastUpdated.textContent = formatted;
            })
            .catch(() => lastUpdated.textContent = "unknown");
    }
}