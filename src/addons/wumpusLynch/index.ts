import { DHWClient } from "../../client/DHWClient";
import { initChaosChannels } from "../../client/utils/initChaosChannels";
import { isChaosGuild } from "../../client/utils/isChaosGuild";
import { TextChannel, Util, Message } from "discord.js";
import { regularMessage } from "../../client/utils/createMessage";

module.exports = (client : DHWClient) => {

    const emotes = [
        "🇦",
        "🇧",
        "🇨",
        "🇩",
        "🇪",
        "🇫",
        "🇬",
        "🇭",
        "🇮"
    ];

    client.setInterval(() => client.guilds.map(async guild => {
        if ((await isChaosGuild(client, guild))) {
            try {
                await initChaosChannels(guild);
            } catch (_) {
                return;
            }
            // Chaos successfully loaded.
            const lynching = client.storage.get("lynching", {});
            const guildLynching = lynching[guild.id];
            const WCManager = client.exports.get("wumpusCoinsManager");
            if (Date.now() > guildLynching.nextLynching || true) {
                // Ok. Time to end and start a lynch.
                const lynchChannel = guild.channels.find(c => c.name === "public-lynching" && c.type === "text" && !!c.parent && c.parent.name.toLocaleLowerCase() === "wumpus kingdom") as TextChannel;
                let member;
                if (guildLynching.message) {
                    // gotta lynch someone


                    try {
                        const message = await lynchChannel.messages.fetch(guildLynching.message);
                        const reaction = message.reactions.filter((_, key) => emotes.includes(key)).sort((a, b) => b.count - a.count).first()!;
                        member = await guild.members.fetch(guildLynching.lynchees[emotes.indexOf(reaction.emoji.name)]);
                        await message.delete();
                        await member.kick();
                    } catch (_) {}

                    // delete message
                }
                const lynchMembers = guild.members.filter(member => member.kickable).sort((mA, mB) => WCManager.get(mA) - WCManager.get(mB)).array().slice(0, emotes.length);
                if (lynchMembers.length > 2) {
                    try {
                        let lynchMessage;
                        if (member) {
                            lynchMessage = await lynchChannel.send(
                                regularMessage(`**${Util.escapeMarkdown(member.user.tag)} (${member.user}) was lynched!**\n\n**Lord Wumpus demands one of these people to be lynched!**\n\n${lynchMembers.map((m, index) => `${emotes[index]} ${Util.escapeMarkdown(m.user.tag)}`).join("\n")}`)
                            ) as Message;
                        } else {
                            lynchMessage = await lynchChannel.send(
                                regularMessage(`**Lord Wumpus demands one of these people to be lynched!**\n\n${lynchMembers.map((m, index) => `${emotes[index]} ${Util.escapeMarkdown(m.user.tag)}`).join("\n")}`)
                            ) as Message;
                        }
                        guildLynching.message = lynchMessage.id;
                        guildLynching.lynchees = lynchMembers.map(m => m.id);
                        guildLynching.nextLynching = Date.now() + (60000 * 60 * 24);
                        client.storage.set("lynching", lynching);
                        for (let i = 0; i < lynchMembers.length; i++) {
                            try {
                                await lynchMessage.react(emotes[i]);
                            } catch (_) {
                                break;
                            }
                        }
                    } catch (_) {}
                }

            }
        }
    }), 60000);

};