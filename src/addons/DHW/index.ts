import { DHWClient } from "../../client/DHWClient";

module.exports = (client : DHWClient) => {
    
    client.on("ready", () => console.log(`${client.user!.tag} is online!`));
    client.on("invalidated", () => console.log("Disconnected. D:"));
    client.on("error", console.error);

};