import { GuildMember } from 'discord.js';
import { client } from '../../app';
import { errorEmbed, successEmbed } from '../../util/embedTemplates';

client.commands.set('ban', {
    name: 'ban',
    arguments: [
        {
            name: 'member',
            type: 'member',
            required: true,
            missing: (msg) => {
                errorEmbed(msg.channel, 'Please make sure to mention or put the ID of any user.');
            },
        },
        // {
        //     name: 'time',
        //     type: 'duration',
        //     required: false,
        // },
        {
            name: 'reason',
            type: '...string',
            required: false,
        },
    ],
    // permissionLevels: [PermissionLevels.BOT_DEV],
    botGuildPerms: ['BAN_MEMBERS'],
    userGuildPerms: ['BAN_MEMBERS'],
    run: (msg, args: BanArgs) => {
        if (!(msg.member!.roles.highest.comparePositionTo(args.member.roles.highest) > 0)) {
            errorEmbed(
                msg.channel,
                "Please make sure to check the permissions between you and the user you're trying to ban. It seems like they have a higher role than you."
            );
            return;
        }
        if (args.member.bannable) {
            args.member
                .ban({
                    reason:
                        msg.author.id + ' banned ' + (args.reason || 'Banned by the ban command'),
                    days: 3,
                })
                .then((member) => {
                    successEmbed(msg.channel, member.user.username + ' has been banned.');
                    return;
                })
                .catch((e) => {
                    console.error(e);
                });
        } else {
            errorEmbed(
                msg.channel,
                "Please make sure to check the permissions between me and the user, it seems like I don't have permission to ban them."
            );
            return;
        }
    },
    iconName: 'law',
    description:
        '*Thanos snap*. This command** permanently** removes a user from the server. They will be __unable to rejoin__ the server unless unbanned. ',
});

interface BanArgs {
    member: GuildMember;
    time?: string;
    reason?: string;
}
