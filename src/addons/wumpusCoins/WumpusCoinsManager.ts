import { DHWStorage } from "../../client/DHWStorage";
import { UserResolvable } from "discord.js";

export class WumpusCoinsManager {

    private storage : DHWStorage;

    private balances : {
        [id : string] : number
    };

    constructor (storage : DHWStorage) {
        this.storage = storage;
        this.balances = this.storage.get("coins", {});
    }

    get (resolvable : UserResolvable) {
        const id = this.resolve(resolvable);
        return this.balances[id] || 0;
    }

    add (resolvable : UserResolvable, amount : number) {
        const id = this.resolve(resolvable);
        this.balances[id] = (this.balances[id] || 0) + amount;
        this.save();
    }

    private save () {
        this.storage!.set("coins", this.balances);
    }

    private resolve (resolvable : UserResolvable) {
        return typeof resolvable === "string" ? resolvable : resolvable.id;
    }
}