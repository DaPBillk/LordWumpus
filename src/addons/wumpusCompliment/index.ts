import { DHWClient } from "../../client/DHWClient";
import { errorMessage, successMessage } from "../../client/utils/createMessage";

module.exports = (client : DHWClient) => {

    const quotes = [
        "is pleased by",
        "laughs at",
        "smiles at",
        "writhes on the floor because of"
    ];

    client.addCommand("compliment", {
        category: "Brilliance Commands",
        description: "Compliment the mighty Lord Wumpus"
    }, async (message, args) => {

        const WCManager = client.exports.get("wumpusCoinsManager");
        const coins = Math.floor(Math.random() * 15) + 4;

        if (args.length < 3 || Math.random() >= 0.5) {
            // Automatic no.
            WCManager.add(message.author!, -coins);
            return message.channel.send(
                errorMessage(`Lord Wumpus is angered by your comment and has taken away ${coins} Wumpus Coins away from you!`)
            );
        }

        return message.channel.send(
            successMessage(`Lord Wumpus ${quotes[Math.floor(Math.random() * quotes.length)]} your comment and gives you ${coins} Wumpus Coins!`)
        );

        
    });

};