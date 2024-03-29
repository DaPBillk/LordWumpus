import { DMChannel, GuildChannel, TextChannel, GuildEmoji, Guild, User, GuildMember, Collection, Snowflake, Speaking, Message, MessageReaction, Presence, Role, CloseEvent, Channel, VoiceState } from "discord.js";

export interface DiscordEvents {
    "channelCreate": (channel : DMChannel | GuildChannel) => void,
    "channelDelete": (channel : DMChannel | GuildChannel) => void,
    "channelPinsUpdate": (channel : DMChannel | TextChannel, time : Date) => void,
    "channelUpdate": (oldChannel : DMChannel | GuildChannel, newChannel : DMChannel | GuildChannel) => void,
    "debug": (info : string) => void,
    "emojiCreate": (emoji : GuildEmoji) => void,
    "emojiDelete": (emoji : GuildEmoji) => void,
    "emojiUpdate": (oldEmoji : GuildEmoji, newEmoji : GuildEmoji) => void,
    "error": (error : Error) => void,
    "guildBanAdd": (guild : Guild, user : User) => void,
    "guildBanRemove": (guild : Guild, user : User) => void,
    "guildCreate": (guild : Guild) => void,
    "guildDelete": (guild : Guild) => void,
    "guildIntegrationsUpdate": (guild : Guild) => void,
    "guildMemberAdd": (member : GuildMember) => void,
    "guildMemberRemove": (member : GuildMember) => void,
    "guildMembersChunk": (members : Collection<Snowflake, GuildMember>, guild : Guild) => void,
    "guildMemberSpeaking": (member : GuildMember, speaking: Readonly<Speaking>) => void,
    "guildMemberUpdate": (oldMember : GuildMember, newMember : GuildMember) => void,
    "guildUnavailable": (guild : Guild) => void,
    "guildUpdate": (oldGuild : Guild, newGuild : Guild) => void,
    "invalidated": () => void,
    "message": (message : Message) => void,
    "messageDelete": (message : Message) => void,
    "messageDeleteBulk": (messages : Collection<Snowflake, Message>) => void,
    "messageReactionAdd": (messageReaction : MessageReaction, user : User) => void,
    "messageReactionRemove": (messageReaction : MessageReaction, user : User) => void,
    "messageReactionRemoveAll": (message : Message) => void,
    "messageUpdate": (oldMessage : Message, newMessage : Message) => void,
    "presenceUpdate": (oldPresence : Presence | null, newPresence : Presence) => void,
    "rateLimit": (rateLimitInfo : { timeout: number, limit: number, method: string, path: string, route: string }) => void,
    "ready": () => void,
    "roleCreate": (role : Role) => void,
    "roleDelete": (role : Role) => void,
    "roleUpdate": (oldRole : Role, newRole : Role) => void,
    "shardDisconnected": (event : CloseEvent, id : number) => void,
    "shardError": (error : Error, shardID : number) => void,
    "shardReady": (id : number) => void,
    "shardReconnecting": (id : number) => void,
    "shardResumed": (id : number, replayedEvents : number) => void,
    "typingStart": (channel : Channel, user : User) => void,
    "userUpdate": (oldUser : User, newUser : User) => void,
    "voiceStateUpdate": (oldState : VoiceState | null, newState : VoiceState) => void,
    "warn": (info : string) => void,
    "webhookUpdate": (channel : TextChannel) => void
}