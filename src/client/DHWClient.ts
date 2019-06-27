import { Client, ClientOptions, Message, Snowflake } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import Enmap from "enmap";
import { DiscordEvents } from "./utils/DiscordEvents";
import { DHWStorage } from "./DHWStorage";
import { configure } from "./utils/configure";
import { DHWExports } from "./DHWExports";

export enum DHWLevel {
    CHAOS, // You want Wumpus to take over.
    BALANCE, // You want a balance of all of the fun.
    BRAVERY, // You want dares.
    BRILLIANCE, // You want knowledge.
    UNSET
};

interface CommandOptions extends CommandOptionsConstructor {
    callback : (message : Message, args : string[]) => void,
    alias: string[]
}

interface CommandOptionsConstructor {
    category: CommandCategory,
    description: string,
    alias?: string[]
}

interface DHWClientOptions extends ClientOptions {
    storageKey : string,
    cooldownDelay : number,
    defaultPrefix : string
}

export type CommandCategory = "Configuration Commands"|"General Commands"|"Bravery Commands"|"Brilliance Commands"|"Chaos Commands";


export class DHWClient extends Client {

    storage : DHWStorage;
    
    exports : DHWExports;

    defaultPrefix : string;

    commands : Enmap<string, CommandOptions>;

    private _listeners : Enmap<string, any>;

    private cooldowns : Enmap<Snowflake, number>;

    private cooldownDelay : number;


    constructor (options : DHWClientOptions) {
        super(options);

        this.cooldownDelay = options.cooldownDelay;
        this.defaultPrefix = options.defaultPrefix;
        this._listeners = new Enmap();
        this.commands = new Enmap();
        this.cooldowns = new Enmap();
        this.storage = new DHWStorage(options.storageKey);
        this.exports = new DHWExports();

        this.createListeners();
    }

    on<DEvent extends keyof DiscordEvents> (event : DEvent, listener : DiscordEvents[DEvent]) {
        
        // Because some listeners are registered before the class is extended.
        if (!this._listeners) {
            //@ts-ignore
            this.addListener.apply(this, arguments);
            return this;
        }
        if (!this._listeners.has(event)) {
            this.addListener(event, (...args) => {
                const cbs = this._listeners.get(event);
                for (const cb of cbs) {
                    cb.apply(this, args);
                }
            });
        }
        this._listeners.ensure(event, []);
        this._listeners.push(event, listener);
        
        return this;
    }

    addCommand (command : string, options : CommandOptionsConstructor, callback : (message : Message, args : string[]) => void) {
        const opts = {
            ...options,
            callback,
            alias: options.alias || []
        };
        this.commands.set(command.toLocaleLowerCase(), opts);
    }

    async launch (token : string) {
        const addons : ((client : DHWClient) => void)[] = await new Promise((r, e) => {
            fs.readdir(path.join(__dirname, "..", "addons"), (err, files) => {
                if (err) e(err);
                r(files.map(name => require(path.join(__dirname, "..", "addons", name))));
            });
        });
        for (const addon of addons) {
            addon(this);
        }
        return this.login(token);
    }

    private createListeners () {
        this.on("message", async message => {
            if (this.isValidCommandMessage(message)) {

                const config = this.storage.get("config", {});
                const guildConfig = config[message.guild!.id] || { 
                    prefix: this.defaultPrefix,
                    level: DHWLevel.UNSET
                };
                const [rawCommand, ...args] = message.content.split(" ");
                const commandStr = rawCommand.slice(guildConfig.prefix.length).toLocaleLowerCase();
                const command = this.commands.get(commandStr) || this.commands.find(command => command.alias.some(command => command.toLocaleLowerCase() === commandStr));
                if (command) {
                    if (command.category === "Bravery Commands" && ![DHWLevel.BRAVERY, DHWLevel.BALANCE, DHWLevel.CHAOS].includes(guildConfig.level)) {
                        return;
                    } else if (command.category === "Brilliance Commands" && ![DHWLevel.BRILLIANCE, DHWLevel.BALANCE, DHWLevel.CHAOS].includes(guildConfig.level)) {
                        return;
                    } else if (command.category === "Chaos Commands" && ![DHWLevel.CHAOS].includes(guildConfig.level)) {
                        return;
                    }
                    this.cooldowns.set(message.author!.id, Date.now() + this.cooldownDelay);
                    try {
                        if (guildConfig.level === DHWLevel.UNSET) {
                            await configure(this, message);
                        } else {
                            await command.callback(message, args);
                        }
                    } catch (_) {}
                }

            }    
        });
    }

    private isValidCommandMessage (message : Message) {
        if (message.author!.bot || message.channel.type !== "text") return false;

        const config = this.storage.get("config", {});
        const guildConfig = config[message.guild!.id] || { 
            prefix: this.defaultPrefix,
            level: DHWLevel.UNSET
        };

        if (!message.content.toLocaleLowerCase().startsWith(guildConfig.prefix.toLocaleLowerCase())) return false; 

        const cooldown = this.cooldowns.get(message.author!.id) || 0;
        if (Date.now() < cooldown) return false;

        return true;
    }
}