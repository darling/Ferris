import { Client, Collection } from 'discord.js';

// Database
import * as admin from 'firebase-admin';

// Util
import { readdir, readdirSync } from 'fs';
import { IConfig } from './assets/config/config';

// import { config } from './assets/config/config';
import { ICommand } from './types/commands';

const type = process.env.TYPE;
const project_id = process.env.PROJECT_ID;
const private_key_id = process.env.PRIVATE_KEY_ID;
const private_key = process.env.PRIVATE_KEY;
const client_email = process.env.CLIENT_EMAIL;
const client_id = process.env.CLIENT_ID;
const curl = process.env.client_x509_cert_url;

if (!type || !project_id || !private_key || !private_key_id || !client_email || !client_id || !curl)
    throw Error('Load console vargs');

const envKey = {
    type: type,
    project_id: project_id,
    private_key_id: private_key_id,
    private_key: private_key,
    client_email: client_email,
    client_id: client_id,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: curl,
};

admin.initializeApp({
    credential: admin.credential.cert(JSON.stringify(envKey)),
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
client.login(process.env.BOT_TOKEN);
