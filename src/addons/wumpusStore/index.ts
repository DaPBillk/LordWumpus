import { DHWClient, DHWLevel } from "../../client/DHWClient";
import { getSelection } from "../../client/utils/getSelection";
import { regularMessage, errorMessage, successMessage } from "../../client/utils/createMessage";
import * as path from "path";

enum StoreOptions {
    CHILD_LORD_WUMPUS_PHOTO,
    COLLEGE_LORD_WUMPUS_PHOTO,
    SWAY_OPINION
}

module.exports = (client : DHWClient) => {
    client.addCommand("store", {
        category: "General Commands",
        description: "Spend your Wumpus Coins"
    }, async message => {

        const WCManager = client.exports.get("wumpusCoinsManager");

        const guildConfig = client.storage.get("config", {})[message.guild!.id];

        const options = [
            {
                id: StoreOptions.CHILD_LORD_WUMPUS_PHOTO,
                text: "A photo of Lord Wumpus as a child - **500 Wumpus Coins**"
            },
            {
                id: StoreOptions.COLLEGE_LORD_WUMPUS_PHOTO,
                text: "A photo of Lord Wumpus revolutionizing \"Nitro\" - **1000 Wumpus Coins**"
            }
        ];

        if (guildConfig.level === DHWLevel.CHAOS) {
            options.push({
                id: StoreOptions.SWAY_OPINION,
                text: "Sway Lord Wumpus' opinion negatively against someone - **2000 Wumpus Coins**"
            });
        }

        const choice = await getSelection(
            message,
            regularMessage(`You currently have **${WCManager.get(message.author!)} Wumpus Coins.**\nWhat would you like to purchase?`),
            options
        );

        if (choice === StoreOptions.CHILD_LORD_WUMPUS_PHOTO) {
            if (WCManager.get(message.author!) < 500) {
                return message.channel.send(
                    errorMessage(`Only ${WCManager.get(message.author!)} Wumpus Coins? What a puny and unworthy amount for a photo of Lord Wumpus.`)
                );
            }
            try {
                await message.author!.send(
                    regularMessage("Glory to **Lord Wumpus**")
                        .setTitle("Lord Wumpus | Child")
                        .setDescription("Here we see Lord Wumpus learning how to ride a motorcycle as a child.\nHow lucky you are to be able to see such a sight at only the price of 500 Wumpus Coins!")
                        .attachFiles([path.join(__dirname, "..", "..", "..", "images", "wumpusMobile.png")])
                        .setImage("attachment://wumpusMobile.png")
                );
                WCManager.add(message.author!, -500);
            } catch (_) {
                await message.channel.send(
                    errorMessage("Lord Wumpus demands you to open your DMs to see the photo.")
                );
                return;
            }
            await message.channel.send(
                successMessage("Purchased a glimsp at Lord Wumpus as a child.")
            );
        } else if (choice === StoreOptions.COLLEGE_LORD_WUMPUS_PHOTO) {
            if (WCManager.get(message.author!) < 1000) {
                return message.channel.send(
                    errorMessage(`Only ${WCManager.get(message.author!)} Wumpus Coins? What a absurd and unworthy amount for a photo of Lord Wumpus.`)
                );
            }
            try {
                await message.author!.send(
                    regularMessage("Glory to **Lord Wumpus**")
                        .setTitle("Lord Wumpus | Nitro")
                        .setDescription("Here we see Lord Wumpus revolutionizing the perks \"Nitro\" has to offer.\nHow honoured you must feel to be able to see such a sight at only the price of 1000 Wumpus Coins!")
                        .attachFiles([path.join(__dirname, "..", "..", "..", "images", "wumpusJetpack.png")])
                        .setImage("attachment://wumpusJetpack.png")
                );
                WCManager.add(message.author!, -1000);
            } catch (_) {
                await message.channel.send(
                    errorMessage("Lord Wumpus demands you to open your DMs to see the photo.")
                );
                return;
            }
            await message.channel.send(
                successMessage("Purchased a glimsp at Lord Wumpus revolutionizing Nitro.")
            );
        } else if (choice === StoreOptions.SWAY_OPINION) {

        }

        return;
    });
};