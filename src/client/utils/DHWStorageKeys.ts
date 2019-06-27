import { DHWLevel } from "../DHWClient";

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
    }
}