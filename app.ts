import { TOKEN } from "./config/config.json";
import { DHWClient } from "./src/client/DHWClient";

const client = new DHWClient({
    storageKey: TOKEN,
    cooldownDelay: 3000,
    defaultPrefix: "w!"
});

client.launch(TOKEN);