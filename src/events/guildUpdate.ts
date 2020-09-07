import { client, db } from '../app';
import { Guild } from 'discord.js';

client.on('guildUpdate', (guild: Guild, newGuild: Guild) => {
    db.ref(`guilds/${guild.id}`).update({
        name: newGuild.name,
    });
    console.log(JSON.stringify(newGuild));
});
