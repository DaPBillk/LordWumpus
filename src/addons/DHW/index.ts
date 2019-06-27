import { DHWClient } from "../../client/DHWClient";
import { configure } from "../../client/utils/configure";

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

};