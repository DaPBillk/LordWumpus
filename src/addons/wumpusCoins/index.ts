import { WumpusCoinsManager } from "./WumpusCoinsManager";
import { DHWClient } from "../../client/DHWClient";
import { regularMessage } from "../../client/utils/createMessage";
import { Util } from "discord.js";

module.exports = (client : DHWClient) => {

    const WCManager = new WumpusCoinsManager(client.storage);

    client.exports.set("wumpusCoinsManager", WCManager);

    client.addCommand("coins", {
        alias: ["wumpusCoins", "wc", "wCoins", "balance"],
        category: "General Commands",
        description: "View all the coins the great Lord Wumpus has given a puny human such as yourself."
    }, async message => {
        const target = message.mentions.users.first() || message.author!;
        await message.channel.send(
            regularMessage(`**${Util.escapeMarkdown(target.tag)}** has **${WCManager.get(target)} Wumpus Coins.**`)
        );
    });

};
