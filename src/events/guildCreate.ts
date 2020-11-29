import { client } from '../app';
import { Guild } from 'discord.js';
import { subscribeConfig } from '../util/db/config';

client.on('guildCreate', (guild: Guild) => {
    subscribeConfig(guild.id);
});
