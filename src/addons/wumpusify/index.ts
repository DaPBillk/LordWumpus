import * as fs from "fs";
import * as path from "path";
import { DHWClient } from "../../client/DHWClient";
import { isChaosGuild } from "../../client/utils/isChaosGuild";

module.exports = (client : DHWClient) => {
    client.setInterval(() => client.guilds.map(async guild => {
        if ((await isChaosGuild(client, guild))) {
            const wumpusify = client.storage.get("wumpusify", {});
            if (wumpusify[guild.id] && wumpusify[guild.id] < Date.now()) {
                delete wumpusify[guild.id];
                client.storage.set("wumpusify", wumpusify);

                try {
                    await guild.emojis.create(fs.readFileSync(path.join(__dirname, "..", "..", "..", "images", "wumpusJetpack.png")), "wumpusFly");
                    await guild.emojis.create(fs.readFileSync(path.join(__dirname, "..", "..", "..", "images", "wumpusMobile.png")), "wumpusMobile");
                    await guild.emojis.create(fs.readFileSync(path.join(__dirname, "..", "..", "..", "images", "wumpusMonster.png")), "wumpusLove");
                    await guild.setName(`Wumpus' Kingdom${"!".repeat(Math.floor(Math.random() * 5) + 2)}`);
                    await guild.setIcon(fs.readFileSync(path.join(__dirname, "..", "..", "..", "images", "wumpusJetpack.png")));
                } catch (_) {}

            }
        }
    }), 2000);
};