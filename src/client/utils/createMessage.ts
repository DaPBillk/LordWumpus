import { MessageEmbed } from "discord.js";

const customMessage = (description : string, color : number) => new MessageEmbed()
    .setDescription(description)
    .setColor(color);

const successMessage = (description : string) => customMessage(description, 0x00ff00);
const errorMessage = (description : string) => customMessage(description, 0xff0000);
const regularMessage = (description : string) => customMessage(description, 0x7289DA);

export {
    customMessage,
    successMessage,
    errorMessage,
    regularMessage
};