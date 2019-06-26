import Enmap from "enmap";
import * as path from "path";
import * as fs from "fs";
import Cryptr from "cryptr";
import { DHWStorageKeys } from "./utils/DHWStorageKeys";

export class DHWStorage {

    private database : Enmap;

    private crypt : Cryptr;

    constructor (key : string) {

        try {
            if (!fs.existsSync(path.join(__dirname, "..", "..", "database"))) {
                fs.mkdirSync(path.join(__dirname, "..", "..", "database"));
            }
        } catch (_) {}
        this.database = new Enmap({
            name: "DHWData",
            dataDir: path.join(__dirname, "..", "..", "database")
        });
        this.crypt = new Cryptr(key);
    }

    set<StorageKey extends keyof DHWStorageKeys> (key : StorageKey, data : DHWStorageKeys[StorageKey]) {
        const encrypted = this.encrypt(data);
        this.database.set(key, encrypted);
    }

    get<StorageKey extends keyof DHWStorageKeys> (key : StorageKey, fallback : DHWStorageKeys[StorageKey]) : DHWStorageKeys[StorageKey] {
        const encrypted = this.database.get(key);
        if (!encrypted) {
            return fallback;
        }
        return this.decrypt(encrypted);
    }

    private encrypt (data : any) {
        data = JSON.stringify(data);
        return this.crypt.encrypt(data);
    }

    private decrypt (encrypted : string) : any {
        return JSON.parse(this.crypt.decrypt(encrypted));
    }

}