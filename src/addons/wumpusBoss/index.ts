import { DHWClient } from "../../client/DHWClient";
import { isChaosGuild } from "../../client/utils/isChaosGuild";
import { initChaosChannels } from "../../client/utils/initChaosChannels";
import { TextChannel, Message } from "discord.js";
import { regularMessage, errorMessage } from "../../client/utils/createMessage";

module.exports = (client : DHWClient) => {

    client.on("messageReactionAdd", async (reaction, user) => {
        const bosses = client.storage.get("bosses", {});
        if (reaction.emoji.name === "🤚" && !user.bot && reaction.message.channel.type !== "dm") {
            const guildBoss = bosses[reaction.message.guild!.id];
            if (guildBoss && guildBoss.message === reaction.message.id) {

                if (guildBoss.attacked.includes(user.id)) {
                    try {
                        await user.send(
                            errorMessage("You're already trying to calm Lord Wumpus! Get some friends to help out!")
                        );
                    } catch (_) {}
                    return;
                }
                guildBoss.attacked.push(user.id);
                guildBoss.health--;
                client.storage.set("bosses", bosses);
                if (guildBoss.health <= 0) {
                    // Boss ded.
                    guildBoss.deleteChannelAt = guildBoss.nextBoss + Date.now() + (60000 * 60 * 24 * (Math.floor(Math.random() * 4) + 3));
                    guildBoss.attacked = [];
                    client.storage.set("bosses", bosses);
                    try {
                        await reaction.message.delete();
                    } catch (_) {}
                    return;
                }
                // Update message.
                try {
                    await reaction.message.edit(
                        regularMessage(`**Lord Wumpus is having a fit! Oh no! If we don't stop him now a random channel will be deleted!**\n\n${guildBoss.health} more ${guildBoss.health === 1 ? "person" : "people"} need${guildBoss.health === 1 ? "s" : ""} to calm him down!\n\nClick 🤚 to calm him down!`)
                    );
                } catch (_) {}

            }
        }
    });
    
    client.setInterval(() => client.guilds.map(async guild => {
        if ((await isChaosGuild(client, guild))) {
            try {
                await initChaosChannels(guild);
            } catch (_) {
                return;
            }
            const bosses = client.storage.get("bosses", {});
            const guildBoss = bosses[guild.id];
            if (guildBoss.nextBoss < Date.now()) {

                guildBoss.nextBoss = Date.now() + (60000 * 60 * 24 * (Math.floor(Math.random() * 8) + 6));
                guildBoss.health = Math.ceil(guild.memberCount / 10);
                guildBoss.attacked = [];
                client.storage.set("bosses", bosses);

                const fitsChannel = guild.channels.find(channel => channel.name === "wumpus-fits" && channel.type === "text" && !!channel.parent && channel.parent.name.toLocaleLowerCase() === "wumpus kingdom") as TextChannel;

                if (guildBoss.message) {
                    try {
                        const message = await fitsChannel.messages.fetch(guildBoss.message);
                        await message.delete();
                    } catch (_) {}

                }

                // SUMMON THE BOSS.
                try {
                    const fitsMessage = await fitsChannel.send(
                        regularMessage(`**Lord Wumpus is having a fit! Oh no! If we don't stop him now a random channel will be deleted!**\n\n${guildBoss.health} more ${guildBoss.health === 1 ? "person" : "people"} need${guildBoss.health === 1 ? "s" : ""} to calm him down!\n\nClick 🤚 to calm him down!`)
                    ) as Message;
                    guildBoss.message = fitsMessage.id;
                    client.storage.set("bosses", bosses);
                    await fitsMessage.react("🤚");
                } catch (_) {}
            }   

            if (guildBoss.deleteChannelAt < Date.now()) {
                // We gotta delete a channel.
                const channels = guild.channels.filter(channel => !(!!channel.parent && channel.parent.name.toLocaleLowerCase() === "wumpus kingdom") && channel.type !== "category");
                const channel = channels.random();
                if (channel) {
                    try {
                        await channel.delete();
                    } catch (_) {}
                }
                guildBoss.deleteChannelAt = guildBoss.nextBoss + Date.now() + (60000 * 60 * 24 * (Math.floor(Math.random() * 4) + 3));
                client.storage.set("bosses", bosses);
            }

        }
    }), 60000);

};