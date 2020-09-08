import { client } from '../app';
import { Guild } from 'discord.js';
import { updateGuild } from '../util/databaseFunctions';

client.on('guildUpdate', (guild: Guild, newGuild: Guild) => {
    updateGuild(newGuild);
});
