import { DHWExportKeys } from "./utils/DHWExportKeys";

export class DHWExports {

    private exports : Map<string, any>;

    constructor () {
        this.exports = new Map();
    }

    get<Export extends keyof DHWExportKeys> (key : Export) : DHWExportKeys[Export] {
        return this.exports.get(key);
    }

    set<Export extends keyof DHWExportKeys> (key : Export, value : DHWExportKeys[Export]) {
        this.exports.set(key, value);
    }
}