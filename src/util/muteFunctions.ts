import { Guild, GuildMember } from 'discord.js';
import { client } from '../app';

async function unmuteUserFromGuild(guild: string, user_id: string, roles: string) {
    const resolvedGuild: Guild | null = client.guilds.resolve(guild);
    if (resolvedGuild === null) return;

    const member: GuildMember | null = resolvedGuild.member(user_id);
    if (member === null) return;

    const old_roles: string[] = roles.split(',');

    old_roles.map((role_id) => {
        resolvedGuild.roles.fetch(role_id, true);
    });

    member.roles.set(old_roles).catch((err: Error) => {
        console.error(err);
    });

    console.log(guild, user_id, old_roles);
}

export { unmuteUserFromGuild };
