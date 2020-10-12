import { Client } from 'discord.js';

// Database
import * as admin from 'firebase-admin';

// Util
import { readdir } from 'fs';

import runSchedule from './util/scheduleHandler';
import { config } from './assets/config/config';

admin.initializeApp({
    credential: admin.credential.cert(config.firebase),
    databaseURL: 'https://ferrisbot-6e0f1.firebaseio.com/',
});

const db = admin.database();
const firestore = admin.firestore();

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

require(__dirname + '/commands');

// Schedule Handler (I.e unbans, unmute)

export { client, FerrisClient, db, firestore, admin };

// Let's start!
client.login(config.token);
