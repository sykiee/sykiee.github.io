const DISCORD_ID = "384860738482733057";

async function updateDiscordPresence() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const result = await response.json();

        if (!result.success) throw new Error();

        const { discord_user: user, discord_status: status } = result.data;

        document.querySelector("#discord-username span").textContent = user.username;
        document.getElementById("discord-avatar").src =
            user.avatar
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}`
                : `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator || 0) % 5}.png`;

        const statusElement = document.getElementById("discord-status");
        const statusLabels = {
            online: "● i'm online!",
            idle: "● i'm idle!",
            dnd: "● i'm busy!",
            offline: "● i'm offline!"
        };

        statusElement.textContent = statusLabels[status] || "status unavailable";
        statusElement.dataset.status = status;
    } catch {
        document.getElementById("discord-status").textContent = "unavailable";
    }
}

updateDiscordPresence();
setInterval(updateDiscordPresence, 30000);