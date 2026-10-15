// this script is under the MIT license (https://max.nekoweb.org/resources/license.txt)
// edits made by me

const USERNAME = "sykiee";
const LASTFM_URL = "https://sykiee-lastfm.majorly08.workers.dev/lastfm";

const getTrack = async () => {
    try {
        const response = await fetch(LASTFM_URL);
        const json = await response.json();
        const tracks = json.recenttracks.track;

        if (!tracks || tracks.length === 0) {
            return;
        }

        const currentTrack = tracks[0];
        const previousTracks = tracks.slice(1, 3);

const lastfmLink = (url, text, style = "") => `
    <a href="${url}" target="_blank" rel="noopener noreferrer" class="lastfm-link" style="
        color: inherit;
        text-decoration: none;
        ${style}
    ">${text.toLowerCase()}</a>
`;

        document.getElementById("listening").innerHTML = `
            <img src="images/lastplayed2.gif" style="
                width: 9.5rem;
                height: auto;
                position: absolute;
                top: -15%;
            ">

            <div style="
                display: flex;
                align-items: center;
                gap: 0.6rem;
                width: 100%;
            ">
                <img
                    src="${currentTrack.image[1]["#text"]}"
                    style="
                        width: 4rem;
                        height: 4rem;
                        object-fit: cover;
                        flex-shrink: 0;
                        border-radius: 0.2rem;
                        filter: brightness(0.8) contrast(1.1) saturate(0.8);
                    "
                >

                <div style="
                    min-width: 0;
                    overflow: hidden;
                    flex: 1;
                ">
                    <div class="track-marquee" style="
                        overflow: hidden;
                        white-space: nowrap;
                        width: 100%;
                    ">
                        <p style="
                            display: inline-block;
                            margin: 0;
                            font-size: 0.75rem;
                            opacity: 0.7;
                        ">
                            ${lastfmLink(currentTrack.url, currentTrack.album["#text"])}
                        </p>
                    </div>

                    <div class="track-marquee" style="
                        overflow: hidden;
                        white-space: nowrap;
                        width: 100%;
                        margin-top: 0.2rem;
                    ">
                        <h3 style="
                            display: inline-block;
                            margin: 0;
                            font-size: 0.95rem;
                        ">
                            ${lastfmLink(currentTrack.url, currentTrack.name)}
                        </h3>
                    </div>

                    <div class="track-marquee" style="
                        overflow: hidden;
                        white-space: nowrap;
                        width: 100%;
                        margin-top: 0.3rem;
                    ">
                        <p style="
                            display: inline-block;
                            margin: 0;
                            font-size: 0.8rem;
                        ">
                            ${lastfmLink(
                                `https://www.last.fm/music/${encodeURIComponent(currentTrack.artist["#text"]).replace(/%20/g, "+")}`,
                                currentTrack.artist["#text"]
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <div style="
                margin-top: 0.7rem;
                padding-top: 0.5rem;
                border-top: 1px dotted #999;
            ">
                ${previousTracks.map(track => `
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        margin-bottom: 0.45rem;
                        min-width: 0;
                    ">
                        <img
                            src="${track.image[0]["#text"]}"
                            style="
                                width: 2rem;
                                height: 2rem;
                                object-fit: cover;
                                flex-shrink: 0;
                                border-radius: 0.15rem;
                                filter: brightness(0.8) contrast(1.1) saturate(0.8);
                            "
                        >

                        <div style="
                            min-width: 0;
                            overflow: hidden;
                            line-height: 1rem;
                        ">
                            <div style="
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                font-size: 0.78rem;
                            ">
                                ${lastfmLink(track.url, track.name, "display: block; overflow: hidden; text-overflow: ellipsis;")}
                            </div>

                            <div style="
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                font-size: 0.7rem;
                                opacity: 0.65;
                            ">
                                ${lastfmLink(
                                    `https://www.last.fm/music/${encodeURIComponent(track.artist["#text"]).replace(/%20/g, "+")}`,
                                    track.artist["#text"],
                                    "display: block; overflow: hidden; text-overflow: ellipsis;"
                                )}
                            </div>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;

        document.querySelectorAll(".track-marquee").forEach(container => {
            const text = container.firstElementChild;

            text.style.animation = "none";
            text.style.transform = "translateX(0)";

            const textWidth = text.scrollWidth;
            const containerWidth = container.clientWidth;

            if (textWidth > containerWidth) {
                const distance = textWidth - containerWidth;

                text.style.setProperty(
                    "--marquee-distance",
                    `-${distance}px`
                );

                const runMarquee = () => {
                    text.style.animation = "none";
                    text.style.transform = "translateX(0)";

                    setTimeout(() => {
                        text.style.animation = "marquee 6s linear";

                        text.addEventListener("animationend", () => {
                            setTimeout(() => {
                                text.style.animation = "none";
                                text.style.transform = "translateX(0)";

                                setTimeout(runMarquee, 500);
                            }, 2000);
                        }, { once: true });
                    }, 500);
                };

                runMarquee();
            }
        });
    } catch (error) {
        console.error("Last.fm error:", error);
    }
};

getTrack();

setInterval(() => {
    getTrack();
}, 10000);