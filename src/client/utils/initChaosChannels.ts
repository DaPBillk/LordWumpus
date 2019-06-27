import { Guild, CategoryChannel, TextChannel } from "discord.js";
import { regularMessage } from "./createMessage";

export const initChaosChannels = async (guild : Guild) => {

    let chaosCategory = guild.channels.find(channel => channel.type === "category" && channel.name.toLocaleLowerCase() === "wumpus kingdom") as CategoryChannel;
    if (!chaosCategory) {
        chaosCategory = await guild.channels.create("Wumpus Kingdom", {
            type: "category",
            position: -1000,
            permissionOverwrites: [
                {
                    id: guild.defaultRole!.id,
                    deny: ["SEND_MESSAGES", "ADD_REACTIONS"],
                    allow: ["READ_MESSAGE_HISTORY", "VIEW_CHANNEL"]
                }
            ]
        }) as CategoryChannel;
    }

    if (!guild.channels.find(channel => channel.type === "text" && channel.name.toLocaleLowerCase() === "public-lynching" && channel.parentID === chaosCategory.id)) {
        const lynching = await guild.channels.create("public-lynching", {
            type: "text",
            parent: chaosCategory.id
        }) as TextChannel;
        await lynching.send(
            regularMessage("**Lord Wumpus demands a lynching!**\nA public lynching will occur soon...")
                .setTitle("Chaotic Lord Wumpus | Public Lynching!")
                .setFooter("The owner of this server can disable chaotic events by reconfiguring the bot. w!config")
        );
    }

    if (!guild.channels.find(channel => channel.type === "text" && channel.name.toLocaleLowerCase() === "wumpus-fits" && channel.parentID === chaosCategory.id)) {
        await guild.channels.create("wumpus-fits", {
            type: "text",
            parent: chaosCategory.id
        });
    }

};