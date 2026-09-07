document.writeln('<div id="statuscafe"><div id="statuscafe-content"></div><div id="statuscafe-username"></div></div>');
fetch("https://status.cafe/users/grasscanons/status.json")
  .then(r => r.json())
  .then(r => {
    if (!r.content.length) {
      document.getElementById("statuscafe-content").innerHTML = "No status yet."
      return
    }
    document.getElementById("statuscafe-content").innerHTML = r.content
    document.getElementById("statuscafe-username").innerHTML = '<a href="https://status.cafe/users/grasscanons" target="_blank">' + r.face + '</a> ' + r.timeAgo
  })

/* MEOW SOUND EFFECT */
const statusImage = document.querySelector("#status img");
const statusSound = document.getElementById("statusSound");

statusImage.addEventListener("click", () => {
  statusSound.currentTime = 0;
  statusSound.play();
});