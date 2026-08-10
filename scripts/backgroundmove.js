let backgroundNumber = 3; function changeBackground() { backgroundNumber++; if (backgroundNumber > 4) { backgroundNumber = 1; } document.body.style.setProperty("--background-url", `url("images/background-${backgroundNumber}.jpg")`); } setInterval(changeBackground, 5750);

document.addEventListener("mousemove", function (event) {

    let x = (event.clientX - window.innerWidth / 2) / 35 * -1;
    let y = (event.clientY - window.innerHeight / 2) / 35 * -1;

    document.body.style.setProperty(
        "--background-transform",
        `translateX(${x}px) translateY(${y}px) scale(1.05)`
    );

});
