import { addWarn } from '../../../util/db/warnings';
import { GuildMember } from 'discord.js';
import { client } from '../../../app';
import { PermissionLevels } from '../../../types/commands';
import { successEmbed } from '../../../util/embedTemplates';

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

        addWarn(
            guild.id,
            args.user.id,
            msg.author.id,
            args.reason || `<@${msg.author.id}> muted this user`
        );

        successEmbed(
            msg.channel,
            `${args.user.user.username} has been warned.`,
            'New warning added.'
        );
    },
});

interface PunishArgs {
    user: GuildMember;
    reason?: string;
}
