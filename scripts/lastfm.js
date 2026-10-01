// this script is under the MIT license (https://max.nekoweb.org/resources/license.txt)
// small edits made by me

const USERNAME = "sykiee";
const BASE_URL = `https://lastfm-last-played.biancarosa.com.br/${USERNAME}/latest-song`;

const getTrack = async () => {
    try {
        const request = await fetch(BASE_URL);
        const json = await request.json();

        const track = json.track;
        const isPlaying = track['@attr']?.nowplaying || false;

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
                    src="${track.image[1]['#text']}"
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
                        <h3 style="
                            display: inline-block;
                            margin: 0;
                            font-size: 0.95rem;
                        ">
                            ${track.name}
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
                            ${track.artist['#text']}
                        </p>
                    </div>

                </div>
            </div>
        `;

        document.querySelectorAll(".track-marquee").forEach(container => {
            const text = container.firstElementChild;

            text.style.animation = "none";

            const textWidth = text.scrollWidth;
            const containerWidth = container.clientWidth;

            if (textWidth > containerWidth) {
                const distance = textWidth - containerWidth;

                text.style.setProperty(
                    "--marquee-distance",
                    `-${distance}px`
                );

                text.style.animation = "marquee 6s linear infinite";
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