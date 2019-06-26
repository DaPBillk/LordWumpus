import { DHWLevel } from "../DHWClient";

export interface DHWStorageKeys {
    config: {
        [id : string]: {
            prefix: string,
            level: DHWLevel
        }
    }
}