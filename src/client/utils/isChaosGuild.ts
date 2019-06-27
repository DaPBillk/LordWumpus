import { DHWClient, DHWLevel } from "../DHWClient";
import { Guild } from "discord.js";

export const isChaosGuild = (client : DHWClient, guild : Guild) => {
    const config = client.storage.get("config", {});
    const guildConfig = config[guild.id] || {
        prefix: "w!",
        level: DHWLevel.UNSET
    };
    return guildConfig.level === DHWLevel.CHAOS;
};