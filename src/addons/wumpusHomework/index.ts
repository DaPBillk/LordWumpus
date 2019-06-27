import { DHWClient } from "../../client/DHWClient";
import * as data from "./questions.json";
import { errorMessage, regularMessage, successMessage } from "../../client/utils/createMessage";
import { getSelection } from "../../client/utils/getSelection";

module.exports = (client : DHWClient) => {

    client.addCommand("homework", {
        category: "Brilliance Commands",
        description: "Lord Wumpus has no time for school."
    }, async message => {
        const question = data.questions[Math.floor(Math.random() * data.questions.length)];

        const questionConfig = client.storage.get("questions", {});
        if (questionConfig[message.author!.id] && questionConfig[message.author!.id] > Date.now()) {
            return message.channel.send(
                errorMessage("Lord Wumpus no longer requires your help right now.")
            );
        }

        const reOrderedChoices : string[] = [];
        for (let i = 0; i < question.choices.length; i++) {
            reOrderedChoices.splice(Math.floor(Math.random() * reOrderedChoices.length), 0, question.choices[i]);
        }

        const choice = await getSelection(
            message,
            regularMessage(question.question),
            reOrderedChoices.map(answer => ({
                id: question.choices.indexOf(answer),
                text: answer
            }))
        );

        if (typeof choice === "number") {
            questionConfig[message.author!.id] = Date.now() + 60000 * 5;
            client.storage.set("questions", questionConfig);
            if (choice === 0) {
                // Correct.
                const coins = Math.floor(Math.random() * 25) + 5;
                return message.channel.send(
                    successMessage(`Lord Wumpus is pleased with your work and rewards you with ${coins} Wumpus Coins.`)
                );
            }
            return message.channel.send(
                errorMessage("Lord Wumpus doesn't think that's right... He is displeased with your efforts.")
            );
        }
        return;
    });

};