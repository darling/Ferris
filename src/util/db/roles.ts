import { GuildChannel, Role } from 'discord.js';
import { db } from '../../app';

export function updateRole(guild_id: string, role: Role) {
    const ref = db.ref(`guilds/${guild_id}/roles/${role.id}`);

    if (role.deleted) {
        ref.remove();
        return;
    }

    ref.update({
        name: role.name,
        position: role.position,
        permissions: role.permissions,
    });
}
