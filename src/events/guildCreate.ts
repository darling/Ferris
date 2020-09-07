import { client } from '../app';
import { Guild } from 'discord.js';
import { ensureGuild } from '../util/databaseFunctions';

client.on('guildCreate', (guild: Guild) => {
    ensureGuild(guild);
});
