import { client, firestore } from '../app';
import { serverConfigs } from '../util/serverInfo';
import runSchedule from '../util/scheduleHandler';
import { newGuild } from '../util/db/guild';
import { IConfigSchema } from '../util/db/config';

client.on('ready', () => {
    const { user, guilds } = client;

    if (!user) throw Error('User is undefined but bot is ready?');

    console.log(`Logged in as ${user.tag}`);

    user.setActivity('/help | ferris.gg', {
        type: 'PLAYING',
        url: 'https://github.com/darling/Ferris',
    });

    runSchedule();

    guilds.cache.forEach(async (guild) => {
        await newGuild(guild);
    });

    const collection = firestore.collection('configs');

    collection.onSnapshot((snapshots) => {
        snapshots.docChanges().forEach(({ doc, type }) => {
            console.log(doc.id, doc.updateTime);
            serverConfigs.set(doc.id, (doc.data() || {}) as IConfigSchema);
        });
    });
});
