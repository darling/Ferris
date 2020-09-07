import { client, db } from '../app';
import { Guild } from 'discord.js';

client.on('guildDelete', (guild: Guild) => {
    db.ref(`guilds/${guild.id}`).remove();
    console.log('Left server');
});
