import { addWarn } from '../../../util/db/warnings';
import { GuildMember } from 'discord.js';
import { client } from '../../../app';
import { PermissionLevels } from '../../../types/commands';

client.commands.set('warn', {
    name: 'warn',
    guildOnly: true,
    permissionLevels: [PermissionLevels.MODERATOR],
    arguments: [
        {
            name: 'user',
            type: 'member',
            required: true,
        },
        {
            name: 'reason',
            type: '...string',
            required: false,
        },
    ],
    run: (msg, args: PunishArgs, guild) => {
        if (!guild) return;

        addWarn(guild.id, args.user.id, msg.author.id, args.reason);
    },
});

interface PunishArgs {
    user: GuildMember;
    reason?: string;
}
