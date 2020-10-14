import { Client, Collection } from 'discord.js';

// Database
import * as admin from 'firebase-admin';

// Util
import { readdir, readdirSync } from 'fs';

import { config } from './assets/config/config';
import { ICommand } from './types/commands';

admin.initializeApp({
    credential: admin.credential.cert(config.firebase),
    databaseURL: 'https://ferrisbot-6e0f1.firebaseio.com/',
});

const db = admin.database();
const firestore = admin.firestore();

// Extending Client to hold some extra data
interface FerrisClient extends Client {
    commands: Collection<string, ICommand>;
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

readdirSync(`${__dirname}/util/arguments`).forEach((file) => {
    require(`./util/arguments/${file}`);
});

client.commands = new Collection<string, ICommand>();
require(__dirname + '/commands');

// Schedule Handler (I.e unbans, unmute)

export { client, FerrisClient, db, firestore, admin };

// Let's start!
client.login(config.token);
