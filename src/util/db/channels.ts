import { GuildChannel } from 'discord.js';
import { client } from '../../app';
import { newGuild, updateGuildProperty } from './guild';

export async function updateChannel(guildId: string, channel: GuildChannel) {
    newGuild(await client.guilds.fetch(guildId));
}
