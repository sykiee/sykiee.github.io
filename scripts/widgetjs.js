// last.fm widget | original script from https://max.nekoweb.org/resources/license.txt | edits and tweaks by me
const LASTFM_URL = "https://sykiee-lastfm.majorly08.workers.dev/lastfm";
const LISTENING = document.getElementById("listening");

const lastfmLink = (url, text) => `
    <a href="${url}" target="_blank" rel="noopener noreferrer" class="lastfm-link">
        ${text.toLowerCase()}
    </a>
`;

const artistUrl = artist =>
    `https://www.last.fm/music/${encodeURIComponent(artist).replace(/%20/g, "+")}`;

const trackInfo = (track, className, content, url = track.url) => `
    <div class="${className}">
        ${lastfmLink(url, content)}
    </div>
`;

const previousTrack = track => `
    <div class="previous-track">
        <img src="${track.image[0]["#text"]}" class="previous-art" alt="">
        <div class="previous-info">
            ${trackInfo(track, "previous-name", track.name)}
            ${trackInfo(track, "previous-artist", track.artist["#text"], artistUrl(track.artist["#text"]))}
        </div>
    </div>
`;

const setupMarquee = container => {
    const text = container.firstElementChild;
    text.style.animation = "none";
    text.style.transform = "translateX(0)";

    if (text.scrollWidth <= container.clientWidth) return;

    text.style.setProperty(
        "--marquee-distance",
        `-${text.scrollWidth - container.clientWidth}px`
    );

    const run = () => {
        text.style.animation = "none";
        text.style.transform = "translateX(0)";

        setTimeout(() => {
            text.style.animation = "marquee 6s linear";

            text.addEventListener("animationend", () => {
                setTimeout(() => {
                    text.style.animation = "none";
                    text.style.transform = "translateX(0)";
                    setTimeout(run, 500);
                }, 2000);
            }, { once: true });
        }, 500);
    };

    run();
};

const getTrack = async () => {
    try {
        const response = await fetch(LASTFM_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const json = await response.json();
        const tracks = json.recenttracks.track;

        if (!tracks?.length) return;

        const [current, ...previous] = tracks;

        LISTENING.innerHTML = `
            <img src="images/lastplayed2.gif" class="lastplayed-title" alt="last played">

            <div class="current-track">
                <img src="${current.image[1]["#text"]}" class="current-art" alt="">

                <div class="track-info">
                    <div class="track-marquee">
                        <p class="track-album">
                            ${lastfmLink(current.url, current.album["#text"])}
                        </p>
                    </div>

                    <div class="track-marquee" style="margin-top: 0.2rem;">
                        <h3 class="track-name">
                            ${lastfmLink(current.url, current.name)}
                        </h3>
                    </div>

                    <div class="track-marquee" style="margin-top: 0.3rem;">
                        <p class="track-artist">
                            ${lastfmLink(artistUrl(current.artist["#text"]), current.artist["#text"])}
                        </p>
                    </div>
                </div>
            </div>

            <img src="images/a11-dashed-line.gif" style="display: block; margin: 0.4rem auto;">

            <div class="previous-tracks">
                ${previous.slice(0, 2).map(previousTrack).join("")}
            </div>
        `;

        LISTENING.querySelectorAll(".track-marquee").forEach(setupMarquee);
    } catch (error) {
        console.error("Last.fm error:", error);
    }
};

getTrack();
setInterval(getTrack, 10000);

// lanyard discord presence widget
const DISCORD_ID = "384860738482733057";

async function updateDiscordStatus() {
    const statusText = document.getElementById("discord-currently-status");

    if (!statusText) return;

    try {
        const response = await fetch(
            `https://api.lanyard.rest/v1/users/${DISCORD_ID}`
        );

        if (!response.ok) throw new Error();

        const result = await response.json();
        if (!result.success) throw new Error();

        const user = result.data.discord_user;
        const status = result.data.discord_status;

        const statuses = {
            online: "online",
            idle: "idle",
            dnd: "busy",
            offline: "offline"
        };

        const currentStatus = statuses[status] || "offline";

        statusText.innerHTML = `
    <span class="discord-status-dot status-${currentStatus}" title="status..">●</span>
    <a class="discord-currently-username"
       href="https://discord.com/users/${DISCORD_ID}"
       target="_blank"
       title="add me on discord :)">@${user.username.toLowerCase()}</a>
    is <span class="status-${currentStatus}">${currentStatus}</span>!
`;

    } catch {
        statusText.innerHTML = `
            <span class="discord-status-dot status-offline">●</span>
            @discord is <span class="status-offline">offline</span>!
        `;
    }
}

updateDiscordStatus();
setInterval(updateDiscordStatus, 60000);

// recent steam games widget
const STEAM_WORKER_URL = "https://steam-status.majorly08.workers.dev/";

async function updateSteamStatus() {
    const gamesContainer = document.getElementById("steam-games");

    if (!gamesContainer) return;

    try {
        const response = await fetch(STEAM_WORKER_URL);
        if (!response.ok) throw new Error();

        const data = await response.json();
        if (data.error) throw new Error();

        const games = data.games || [];

        gamesContainer.textContent = games.length
            ? games.map(game => game.name.toLowerCase()).join(", ")
            : "no recent games";

    } catch {
        gamesContainer.textContent = "status unavailable";
    }
}

updateSteamStatus();
setInterval(updateSteamStatus, 60000);

// status.cafe widget
fetch("https://status.cafe/users/grasscanons/status.json")
    .then(r => r.json())
    .then(r => {
        document.getElementById("statuscafe-time").textContent = r.timeAgo;
        document.getElementById("statuscafe-content").textContent =
            r.content || "no status yet.";
    });

// custom tooltips
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

    const gap = 1;

    customTooltip.style.left = "0px";
    customTooltip.style.top = "0px";

    const rect = customTooltip.getBoundingClientRect();

    let x = mouseX + gap;
    let y = mouseY + gap;

    if (x + rect.width > window.innerWidth - 8) {
        x = mouseX - rect.width - gap;
    }

    if (y + rect.height > window.innerHeight - 8) {
        y = mouseY - rect.height - gap;
    }

    x = Math.max(8, Math.min(x, window.innerWidth - rect.width - 8));
    y = Math.max(8, Math.min(y, window.innerHeight - rect.height - 8));

    customTooltip.style.left = `${x + window.scrollX}px`;
    customTooltip.style.top = `${y + window.scrollY}px`;
}

function hideCustomTooltip() {
    clearTimeout(tooltipTimer);

    if (
        tooltipTarget &&
        tooltipTarget.dataset.customTooltipTitle !== undefined
    ) {
        tooltipTarget.setAttribute(
            "title",
            tooltipTarget.dataset.customTooltipTitle
        );

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
        if (!tooltipTarget || !tooltipTarget.isConnected) return;

        customTooltip.textContent = title;
        customTooltip.classList.add("visible");
        positionCustomTooltip();
    }, 100);
});

document.addEventListener("mousemove", event => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (tooltipTarget && customTooltip.classList.contains("visible")) {
        positionCustomTooltip();
    }
});

document.addEventListener("mouseout", event => {
    if (!tooltipTarget) return;

    if (
        event.target === tooltipTarget ||
        event.target.closest("[title]") === tooltipTarget
    ) {
        if (
            event.relatedTarget &&
            tooltipTarget.contains(event.relatedTarget)
        ) {
            return;
        }

        hideCustomTooltip();
    }
});

document.addEventListener("mousedown", hideCustomTooltip);
document.addEventListener("scroll", hideCustomTooltip, true);
window.addEventListener("blur", hideCustomTooltip);
