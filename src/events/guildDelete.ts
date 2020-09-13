import { client, db, firestore } from '../app';
import { Guild } from 'discord.js';
import { serverConfigs } from '../util/serverinfo';

client.on('guildDelete', (guild: Guild) => {
    db.ref(`guilds/${guild.id}`).remove();
    firestore.collection('guilds').doc(guild.id).collection('punishments').listDocuments().then(docs => {
        docs.map(doc => {
            doc.delete();
        })
    });
    serverConfigs.delete(guild.id);
    console.log('Left server');
});
