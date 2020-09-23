import { client } from '../app';
import { Guild } from 'discord.js';
import { newGuild as DBNewGuild } from '../util/databaseFunctions';

client.on('guildUpdate', (guild: Guild, newGuild: Guild) => {
    DBNewGuild(newGuild);
});
