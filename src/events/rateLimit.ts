import { client, firestore } from '../app';
import { serverConfigs } from '../util/serverInfo';
import runSchedule from '../util/scheduleHandler';
import { newGuild } from '../util/db/guild';
import { IConfigSchema } from '../util/db/config';
import { RateLimitData } from 'discord.js';

client.on('rateLimit', (rateLimit: RateLimitData) => {
    const date = new Date();
    firestore.collection('ratelimits').doc(`Error ${date.getTime()}`).set(rateLimit);
});

client.on('error', (error) => {
    const date = new Date();
    firestore.collection('errors').doc(`Error ${date.getTime()}`).set(error);
});
