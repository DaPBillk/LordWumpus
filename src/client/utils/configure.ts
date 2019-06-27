import { Message, Util } from "discord.js";
import { DHWClient, DHWLevel } from "../DHWClient";
import { errorMessage, regularMessage, successMessage } from "./createMessage";
import { getSelection } from "./getSelection";

export const configure = async (client : DHWClient, message : Message) => {

    const config = client.storage.get("config", {});

    const owner = await message.guild!.members.fetch(message.guild!.ownerID);
    if (message.member!.id === owner.id) {
        // Valid.
        const level = await getSelection(
            message,
            regularMessage("**Lord Wumpus** can be very angry and demanding. It is recommended you limit him if you do not wish to see the **world burn**."), [
            {
                id: DHWLevel.CHAOS,
                text: "Chaos - If you no longer care for the server and wish to see **Lord Wumpus** rule with an iron fist.\n(ADMINISTRATOR required)"
            },
            {
                id: DHWLevel.BALANCE,
                text: "Balance - An equal amount of effects of brilliance and bravery.\n(MANAGE_CHANNELS required)"
            },
            {
                id: DHWLevel.BRILLIANCE,
                text: "Brilliance - If you would rather read Ancient Wumponian text\n(MANAGE_CHANNELS required)"
            },
            {
                id: DHWLevel.BRAVERY,
                text: "Bravery - For those who dare to challenge Wumpus' brethren"
            }
        ]);
        if (typeof level === "number") {

            const permissions = (await message.guild!.members.fetch(message.client.user!)).permissions;

            const guildConfig = config[message.guild!.id] || {
                prefix: "w!",
                level: DHWLevel.UNSET
            };
            let success = false;
            switch (level) {
                case DHWLevel.CHAOS:
                        if (permissions.has("ADMINISTRATOR")) {
                            success = true;
                            await message.channel.send(
                                regularMessage("**Lord Wumpus** starts laughing maniacally and slowly glows red as he floats into the sky.\nAll hope is lost...")
                                    .setFooter("Commands can now be used.")
                            );
                        } else {
                            await message.channel.send(
                                errorMessage("**Lord Wumpus** does not have the administrator permission.")
                            );
                        }
                break;
                case DHWLevel.BALANCE:
                        if (permissions.has("MANAGE_CHANNELS")) {
                            success = true;
                            await message.channel.send(
                                successMessage("**Lord Wumpus** understands your intentions.\nDo not waste his time.")
                                    .setFooter("Commands can now be used.")
                            );
                        } else {
                            await message.channel.send(
                                errorMessage("**Lord Wumpus** does not have the manage channels permission.")
                            );
                        }
                break;
                case DHWLevel.BRILLIANCE:
                        if (permissions.has("MANAGE_CHANNELS")) {
                            success = true;
                            await message.channel.send(
                                successMessage("**Lord Wumpus** understands your intentions.\nI wish you the best in **pleasing him very well.**")
                                    .setFooter("Commands can now be used.")
                            );
                        } else {
                            await message.channel.send(
                                errorMessage("**Lord Wumpus** does not have the manage channels permission.")
                            );
                        }
                break;
                case DHWLevel.BRAVERY:
                        success = true;
                        await message.channel.send(
                            successMessage("**Lord Wumpus** understands your intentions.\nYou feel the eyes of Lord Wumpus' brethren weighing you down.")
                                .setFooter("Commands can now be used.")
                        );
                break;
            }
            if (success) {
                guildConfig.level = level;
                config[message.guild!.id] = guildConfig;
                client.storage.set("config", config);
            }
        }
    } else {
        await message.channel.send(
            errorMessage(`The owner of this server (**${Util.escapeMarkdown(owner.user.tag)}**) must configure the bot.`)
        );
        return false;
    }

    return true;
};