import { DHWLevel } from "../DHWClient";
import { Snowflake } from "discord.js";

export interface DHWStorageKeys {
    config: {
        [id : string]: {
            prefix: string,
            level: DHWLevel
        }
    },
    coins: {
        [id : string] : number
    },
    questions: {
        [id : string] : number
    },
    lynching: {
        [id : string] : {
            nextLynching : number,
            message? : Snowflake,
            lynchees: string[]
        }
    },
    wumpusify: {
        [id : string] : number
    },
    bosses: {
        [id : string] : {
            health : number,
            deleteChannelAt : number,
            nextBoss : number,
            attacked : string[],
            message? : Snowflake,
        }
    }
}