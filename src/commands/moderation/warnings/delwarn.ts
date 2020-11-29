import { TextChannel } from 'discord.js';
import { deleteWarn, getWarningsForUser, IWarnings } from '../../../util/db/warnings';
import { GuildMember } from 'discord.js';
import { client } from '../../../app';
import { sendSimpleEmbed } from '../../../util/embed';
import { PermissionLevels } from '../../../types/commands';

client.commands.set('delwarn', {
    name: 'delwarn',
    guildOnly: true,
    arguments: [
        {
            name: 'member',
            type: 'member',
            required: true,
        },
        {
            name: 'warning',
            type: 'number',
            required: true,
        },
    ],
    permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
    run: async (msg, args: PunishArgs, guild) => {
        if (!guild) return;

        const warnings: IWarnings | undefined = await getWarningsForUser(guild.id, args.member.id); // serverConfigs.get(guild.id)?.warns?.[args.member.id];

        if (warnings === undefined) {
            sendSimpleEmbed(
                args.member.user.tag + ' does not have any warns to delete.',
                msg.channel as TextChannel
            );
            return;
        }

        const timestamp = Object.keys(warnings);
        console.log(timestamp[args.warning - 1], args.warning, timestamp.length, timestamp);
        if (args.warning <= timestamp.length && args.warning >= 1) {
            deleteWarn(guild.id, args.member.id, timestamp[args.warning - 1]);
        } else {
            sendSimpleEmbed(
                'Please list a valid warn number. You can find them in the `listwarns` command.',
                msg.channel as TextChannel
            );
        }
    },
});

interface PunishArgs {
    member: GuildMember;
    warning: number;
}