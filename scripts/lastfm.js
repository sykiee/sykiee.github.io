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
        const isPlaying = currentTrack["@attr"]?.nowplaying || false;
        const previousTracks = tracks.slice(1, 3);

        document.getElementById("listening").innerHTML = `
            <h2 style="
                margin: -0.1rem 0 0.5rem 0;
                padding: 0;
                font-size: 19px;
            ">
                ${isPlaying ? "🎵 currently playing.." : "🎵 last played.."}
            </h2>

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
                            ${currentTrack.album["#text"]}
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
                            ${currentTrack.name}
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
                            ${currentTrack.artist["#text"]}
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
                                ${track.name}
                            </div>

                            <div style="
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                font-size: 0.7rem;
                                opacity: 0.65;
                            ">
                                ${track.artist["#text"]}
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
