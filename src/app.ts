import { Client } from 'discord.js';

// Database
import * as admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert(require('./assets/config/ferrisbot-6e0f1-firebase-adminsdk-gi47c-79a7d90ec8.json')),
    databaseURL: 'https://ferrisbot-6e0f1.firebaseio.com/',
});

const db = admin.database();
const firestore = admin.firestore();

// Other libs
import { readdir } from 'fs';

// Extending Client to hold some extra data
interface FerrisClient extends Client {
    commands: Map<string, any>;
}

const client = new Client() as FerrisClient;

// Commands and imports setup

readdir(__dirname + '/events', (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        // if (!file.endsWith('.js')) return;
        import(`./events/${file}`);
    });
});

client.commands = new Map();

readdir(__dirname + '/commands', (err, files) => {
    if (err) return console.error(err);

    files.forEach((file) => {
        if (!file.endsWith('.js')) return;

        let commandName = file.split('.')[0];

        import(`./commands/${file}`).then((prop) => {
            client.commands.set(commandName, prop);

            if (prop.aliases) {
                prop.aliases.forEach((alias: string) => {
                    client.commands.set(alias, prop);
                });
            }
        });
    });
});

// Schedule Handler (I.e unbans, unmute)
import runSchedule from './util/scheduleHandler';

export { client, FerrisClient, db, firestore, admin };

// Let's start!
import { token } from './assets/config/config.json';

client.login(token).then(() => {
    client.user?.setActivity('commands', {
        type: 'LISTENING',
        url: 'https://github.com/darling/Ferris',
    });
    runSchedule();
});
