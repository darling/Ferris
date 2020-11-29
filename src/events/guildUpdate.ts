import { client } from '../app';
import { Guild } from 'discord.js';
import {newGuild} from './../util/db/guild'

client.on('guildUpdate', (_guild: Guild, guild: Guild) => {
    newGuild(guild);
});
