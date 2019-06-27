import * as path from "path";
import { DHWClient, DHWLevel } from "../../client/DHWClient";
import { Snowflake, Message, Util } from "discord.js";
import { regularMessage } from "../../client/utils/createMessage";

module.exports = (client : DHWClient) => {
    
    const channels : Map<Snowflake, number> = new Map();

    const MIN_MESSAGES = 25;
    const MAX_MESSAGES = 75;

    const wumpusMessages : Set<Snowflake> = new Set();
    
    const wumpusType = [
        "innocent",
        "heartbroken",
        "adorable",
        "single"
    ];

    client.on("messageReactionAdd", async (reaction, user) => {
        const WCManager = client.exports.get("wumpusCoinsManager");
        if (wumpusMessages.has(reaction.message.id) && !user.bot) {
            wumpusMessages.delete(reaction.message.id);

            const amount = Math.floor(Math.random() * 20) + 5;

            WCManager.add(user.id, amount);
            try {
                await reaction.message.edit(
                    regularMessage(`The ${wumpusType[Math.floor(Math.random() * wumpusType.length)]} Wumpus was slain by **${Util.escapeMarkdown(user.tag)}**.\nLord Wumpus seemed pleased and rewarded them with **${amount} Wumpus Coins**`)
                        .setImage("attachment://wumpusMonster.png")
                );
            } catch (_) {}
        }
    });

    client.on("message", async message => {

        if (message.channel.type === "dm") return;

        const guildLevel = (client.storage.get("config", {})[message.guild!.id] || {
            prefix: "w!",
            level: DHWLevel.UNSET
        }).level;

        if (!message.author!.bot && (guildLevel === DHWLevel.BRAVERY || guildLevel === DHWLevel.BALANCE || guildLevel === DHWLevel.CHAOS)) {
            const messagesLeft = channels.get(message.channel.id) || Math.floor(Math.random() * (MAX_MESSAGES - MIN_MESSAGES)) + MIN_MESSAGES;
            if (messagesLeft <= 1) {
                channels.delete(message.channel.id);
                try {
                    const wumpusMessage = await message.channel.send(
                        regularMessage("An enemy Wumpus has appeared vying for the throne!\nSlay it for Wumpus' enjoyment!")
                            .attachFiles([path.join(__dirname, "..", "..", "images", "wumpusMonster.png")])
                            .setImage("attachment://wumpusMonster.png")
                            .setFooter("React with the swords emoji to slay the Wumpus!")
                    ) as Message;
                    wumpusMessages.add(wumpusMessage.id);
                    await wumpusMessage.react("⚔");
                } catch (_) {}
            } else {
                channels.set(message.channel.id, messagesLeft - 1);
            }
        }
    });

};