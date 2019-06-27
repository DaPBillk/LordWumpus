import { DHWClient } from "../../client/DHWClient";
import * as data from "./texts.json";
import { regularMessage } from "../../client/utils/createMessage";

module.exports = (client : DHWClient) => {

    const ACITONS = [
        "cooking",
        "dreaming",
        "daydreaming",
        "pwning",
        "discording",
        "talking",
        "walking over others",
        "slapping others",
        "napping",
        "clapping",
        "eating",
        "texting",
        "dictating others",
        "programming",
        "befriending others"
    ];

    const OBJECTS = [
        "pizza",
        "dumpling",
        "phone",
        "iron",
        "flower",
        "water",
        "watergun",
        "game",
        "charger",
        "paper",
        "pencil",
        "jetpack",
        "motorcycle",
        "yacht",
        "cupcake",
        "waffle",
        "pancake"
    ];

    const PEOPLE = [
        "Wumpus",
        "Solarion",
        "BlueTarget",
        "Aspekt",
        "atf",
        "Xepherian",
        "Blythe",
        "Zencha",
        "hoges",
        "JP_Williams",
        "kadybat",
        "kayygee",
        "night",
        "Supratik",
        "taime",
        "tcoil",
        "Voltana",
        "zorkian",
        "Talon",
        "gary",
        "Mallory"
    ];

    client.addCommand("legend", {
        category: "Brilliance Commands",
        description: "Listen to a legend of the mighty Lord Wumpus!"
    }, async message => {

        // Add more people the more the command is used.
        if (!PEOPLE.includes(message.author!.username)) {
            PEOPLE.push(message.author!.username);
        }

        let text = data.texts[Math.floor(Math.random() * data.texts.length)];
        
        while (text.match(/{ACTION}/)) {
            text = text.replace(/{ACTION}/, ACITONS[Math.floor(Math.random() * ACITONS.length)]);
        }

        while (text.match(/{OBJECT}/)) {
            text = text.replace(/{OBJECT}/, OBJECTS[Math.floor(Math.random() * OBJECTS.length)]);
        }

        while (text.match(/{PERSON}/)) {
            text = text.replace(/{PERSON}/, PEOPLE[Math.floor(Math.random() * PEOPLE.length)]);
        }

        await message.channel.send(
            regularMessage(text)
                .setTitle("Wumpus Legends | The Wumpening")
        );

    });
};