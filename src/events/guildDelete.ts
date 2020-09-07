import { client, db, firestore } from '../app';
import { Guild } from 'discord.js';

client.on('guildDelete', (guild: Guild) => {
    db.ref(`guilds/${guild.id}`).remove();
    firestore.collection('guilds').doc(guild.id).collection('punishments').listDocuments().then(docs => {
        docs.map(doc => {
            doc.delete();
        })
    });
    console.log('Left server');
});
