fetch("https://status.cafe/users/grasscanons/status.json")
    .then(r => r.json())
    .then(r => {
        document.getElementById("statuscafe-time").textContent = r.timeAgo;
        document.getElementById("statuscafe-content").textContent =
            r.content || "no status yet.";
    });