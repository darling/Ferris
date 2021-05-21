require('dotenv').config();

import { Client, Collection } from 'discord.js';
import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';

// Database
import * as admin from 'firebase-admin';

// Util
import { readdir, readdirSync } from 'fs';
// import './util/scheduler/cloudClient';

// import { IConfig } from './assets/config/config';
// import { config } from './assets/config/config';

import { ICommand } from './types/commands';

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://ferrisbot-6e0f1.firebaseio.com/',
});

const firestore = admin.firestore();

// Extending Client to hold some extra data
interface FerrisClient extends Client {
    commands: Collection<string, ICommand>;
}

const client = new Client() as FerrisClient;

export const FERRIS_ID: string = process.env.BOT_ID!;

// Commands and imports setup

readdir(__dirname + '/events', (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        import(`./events/${file}`);
    });
});

// inhibitors is an auto-mod thing
['arguments', /* 'inhibitors', */ 'permissionLevels', 'passive'].forEach((name) => {
    readdirSync(`${__dirname}/util/${name}`).forEach((file) => {
        require(`./util/${name}/${file}`);
    });
});

client.commands = new Collection<string, ICommand>([]);
require(__dirname + '/commands');

// Schedule Handler (I.e unbans, unmute)

export { client, FerrisClient, firestore, admin };

// Let's start!
client.login(process.env.BOT_TOKEN);

// Now that we have that, I want to implement the server logic so that the website can talk to the bot! (wow!)

import('./server');
