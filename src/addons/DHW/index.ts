import { DHWClient, CommandCategory, DHWLevel } from "../../client/DHWClient";
import { configure } from "../../client/utils/configure";
import { regularMessage } from "../../client/utils/createMessage";

module.exports = (client : DHWClient) => {
    
    client.on("ready", () => console.log(`${client.user!.tag} is online!`));
    client.on("invalidated", () => console.log("Disconnected. D:"));
    client.on("error", console.error);

    client.addCommand("config", {
        alias: ["level", "configure"],
        category: "Configuration Commands",
        description: "Configure Lord Wumpus' strictness"
    }, async message => {
        await configure(client, message);
    });

    client.addCommand("help", {
        category: "General Commands",
        description: "View the command list."
    }, async message => {

        const config = client.storage.get("config", {});
        const guildConfig = config[message.guild!.id];

        const categories : Map<CommandCategory, { command : string, description : string }[]> = new Map();

        client.commands.forEach((options, command) => {
            if (!categories.has(options.category)) {
                categories.set(options.category, [{ command, description: options.description }]);
            } else {
                categories.set(options.category, [...categories.get(options.category)!, { command, description: options.description }]);
            }
        }); 

        let embed = regularMessage("Blessed are thou who hath recieved such legendary commands from the mighty Lord Wumpus.")
            .setTitle("Lord Wumpus' Decree");

        for (const [category, commands] of categories) {
            if ((category === "Chaos Commands" && guildConfig.level === DHWLevel.CHAOS) || (category === "Brilliance Commands" && (guildConfig.level === DHWLevel.BALANCE || guildConfig.level === DHWLevel.BRILLIANCE)) || (category === "Bravery Commands" && (guildConfig.level === DHWLevel.BRAVERY || guildConfig.level === DHWLevel.BALANCE)) || (!["Bravery Commands", "Chaos Commands", "Brilliance Commands"].includes(category)) ) {
                embed = embed.addField(category, commands.map(command => `**${command.command}** - ${command.description}`).join("\n"));
            }
        }

        await message.channel.send(
            embed
        );
    });

};