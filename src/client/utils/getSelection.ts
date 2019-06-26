import { MessageEmbed, Message, EmojiResolvable, MessageReaction, User } from "discord.js";

const emotes = [
    "🇦",
    "🇧",
    "🇨",
    "🇩",
    "🇪",
    "🇫",
    "🇬",
    "🇭",
    "🇮"
];

const arrows = [
    "⬅",
    "➡"
];

const react = async (message : Message, reactions : EmojiResolvable[]) => {
    if (reactions.length === 0) return;
    try {
        await message.react(reactions[0]);
        react(message, reactions.slice(1));
    } catch (_) {}
};

const getSelection = async (message : Message, embed : MessageEmbed, options : { text: string, id: number }[]) => {

    const oDesc = embed.description;

    const sentMessage = await message.channel.send(
        embed
            .setDescription(`${oDesc}\n\n${options.slice(0, emotes.length).map((option, index) => `${emotes[index]} ${option.text}`).join("\n\n")}`)
    ) as Message;
    if (options.length > emotes.length) {
        // We need arrows.
        react(sentMessage, [arrows[0], ...emotes, arrows[1]]);
    } else {
        react(sentMessage, emotes.slice(0, options.length));
    }
    
    const collector = sentMessage.createReactionCollector((reaction : MessageReaction, user : User) => [...arrows, ...emotes].includes(reaction.emoji.name) && user.id === message.author!.id, {
        time: 60000 * 5
    });

    let page = 0;

    const choice : number = await new Promise(resolve => {

        collector.on("collect", async (reaction) => {
            const emoji = reaction.emoji.name;
            if (arrows.includes(emoji)) {
                if (emoji === arrows[0] && page !== 0) {
                    // back
                    page--;
                } else if (emoji === arrows[1] && page !== Math.floor(options.length / emotes.length)) {
                    // forward
                    page++;
                }
                const elements = options.slice(page * emotes.length, page * emotes.length + emotes.length);
                try {
                    await sentMessage.edit(
                        embed
                            .setDescription(`${oDesc}\n\n${elements.map((option, index) => `${emotes[index]} ${option.text}`).join("\n\n")}`)
                    );
                } catch (_) {}
            } else {
                // emotes
                resolve(options[page * emotes.length + emotes.indexOf(emoji)].id);
                collector.stop();
            }
        });

        collector.on("end", async () => {
            try {
                await sentMessage.delete();
            } catch (_) {}
        });

    });

    return choice;

    

};

export {
    getSelection
};