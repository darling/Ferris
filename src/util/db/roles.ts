import { GuildChannel, Role } from 'discord.js';
import { client, firestore } from '../../app';
import { newGuild } from './guild';

export async function updateRole(guildId: string, role: Role) {
    newGuild(await client.guilds.fetch(guildId));
}
