import { client, db, firestore } from '../app';
import { Guild } from 'discord.js';
import { serverConfigs } from '../util/serverInfo';

client.on('guildDelete', async (guild: Guild) => {
    await db.ref(`guilds/${guild.id}`).off();
    // TODO: guildDelete doesn't mean guild is removed from the bot.
    // await db.ref(`guilds/${guild.id}`).remove();
    // firestore.collection('guilds').doc(guild.id).collection('punishments').listDocuments().then(docs => {
    //     docs.map(doc => {
    //         doc.delete();
    //     })
    // });
    serverConfigs.delete(guild.id);
    console.log('Left server');
});
