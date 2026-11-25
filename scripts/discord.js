
// poached from the internet, take what you want :)

// discord activity widget

const escapeText = str => String(str ?? "").replace(/[&<">]/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
}[char]));

const userId = "384860738482733057";
const timeZone = "America/Chicago";

const discordCard = document.getElementById("discord-card");
const discordButton = document.getElementById("discord-button");
const avatar = document.getElementById("button-avatar");
const discordDot = document.getElementById("button-dot");
const clock = document.getElementById("button-time");

// discord tooltips

const initDiscordTooltips = () => {
    if (!discordCard || typeof jQuery === "undefined" || !jQuery.fn.style_my_tooltips) return;

    jQuery(discordCard).find("[title]").style_my_tooltips({
        tip_follows_cursor: true,
        tip_delay_time: 100,
        tip_fade_speed: 200,
        attribute: "title"
    });
};

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


const getAvatar = user => user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(user.id) >> 22n) % 6n)}.png`;


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
    const minutes = Math.floor(seconds % 3600 / 60);

    return hours ? `${hours}h ${minutes}m` : minutes ? `${minutes}m` : `${seconds}s`;
};


const showActivity = activity => activity.type !== 2 && activity.type !== 4;


const updateButton = () => {
    if (!discordDot || !avatar) return;

    const status = discordStatusNames[presence?.discord_status] || "offline";
    discordDot.className = `presence-dot status-${status}`;

    if (presence?.discord_user) {
        const image = getAvatar(presence.discord_user);

        if (avatar.src !== image) avatar.src = image;
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
                const activityName = activity.name || "Unknown activity";

                return `
                    <div class="presence-item">
                        <div class="presence-item-image" title="${escapeText(activityName)}">
                            ${image
                                ? `<img src="${escapeText(image)}">`
                                : `<span>🎮</span>`}
                        </div>
                        <div class="presence-item-info">
                            <div class="presence-item-title" title="${escapeText(activityName)}">${escapeText(activityName)}</div>
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

    const albumName = (spotify.album || spotify.song || "spotify").toLowerCase();

    return `
        <div class="presence-section">
            <div class="presence-section-label spotify-label spotify-active">
                <span class="spotify-indicator"></span>
                LISTENING TO
            </div>
            <div class="presence-item spotify-item">
                <div class="presence-item-image spotify-art" title="${escapeText(albumName)}">
                    ${spotify.album_art_url
                        ? `<img src="${escapeText(spotify.album_art_url)}">`
                        : `<span>🎵</span>`}
                </div>
                <div class="presence-item-info">
                    <div class="presence-item-title">
                        ${spotifyUrl
                            ? `<a class="spotify-song-link" title="${escapeText(spotify.song)}" href="${escapeText(spotifyUrl)}" target="_blank" rel="noopener noreferrer">${escapeText(spotify.song)}</a>`
                            : `<span title="${escapeText(spotify.song)}">${escapeText(spotify.song)}</span>`}
                    </div>
                    <div class="presence-item-subtitle">
                        ${spotifyUrl
                            ? artists.map(name => `
                                <a class="spotify-artist-link" title="${escapeText(name)}" href="https://open.spotify.com/search/${encodeURIComponent(name)}" target="_blank" rel="noopener noreferrer">${escapeText(name)}</a>
                            `).join(", ")
                            : escapeText(artists.join(", "))}
                    </div>
                    <div class="spotify-now-playing">NOW PLAYING</div>
                </div>
            </div>

            <!-- displays the song progress bar when timestamps are available -->
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


const cardIsOpen = () => discordCard?.classList.contains("open");


const updateTimers = () => {
    if (!cardIsOpen()) return;

    discordCard.querySelectorAll(".activity-duration").forEach(timer => {
        timer.textContent = `${timer.dataset.verb} for ${activityTime(Date.now() - Number(timer.dataset.start))}`;
    });
};


const updateProgress = () => {
    if (!cardIsOpen()) return;

    const progress = discordCard.querySelector(".spotify-progress");
    if (!progress) return;

    const start = Number(progress.dataset.start);
    const end = Number(progress.dataset.end);

    if (!start || end <= start) return;

    const duration = end - start;
    const elapsed = Math.max(0, Math.min(Date.now() - start, duration));

    progress.querySelector(".spotify-progress-fill").style.width = `${elapsed / duration * 100}%`;
    progress.querySelector(".spotify-elapsed").textContent = songTime(elapsed);
    progress.querySelector(".spotify-duration").textContent = songTime(duration);
};


const updateCard = () => {
    if (!discordCard) return;

    if (!presence?.discord_user) {
        discordCard.innerHTML = `
            <div class="presence-empty">discord status unavailable</div>
            ${activityHTML([])}
            ${spotifyHTML(null)}`;

        initDiscordTooltips();
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

    initDiscordTooltips();

    updateTimers();
    updateProgress();
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


const updateDisplay = () => {
    updateClock();
    updateTimers();
    updateProgress();
};


updateDisplay();
getPresence();

setInterval(updateDisplay, 1000);

setInterval(getPresence, 30000);


document.addEventListener("visibilitychange", () => {
    if (!document.hidden) getPresence();
});
