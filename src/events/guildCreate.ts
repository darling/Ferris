import { client } from '../app';
import { Guild } from 'discord.js';
import { watchGuild } from '../util/databaseFunctions';

client.on('guildCreate', (guild: Guild) => {
    watchGuild(guild);
});
