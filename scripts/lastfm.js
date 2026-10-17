// MIT license: https://max.nekoweb.org/resources/license.txt
// edits made by me

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