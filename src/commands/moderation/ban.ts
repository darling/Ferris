import { GuildMember } from 'discord.js';
import { client } from '../../app';
import { getErrorEmbed, getSuccessEmbed } from '../../util/embedTemplates';

client.commands.set('ban', {
    name: 'ban',
    arguments: [
        {
            name: 'member',
            type: 'member',
            required: true,
            missing: (msg) => {
                const embed = getErrorEmbed();

                embed.setTitle('Uh oh!');
                embed.setDescription('Please make sure to mention or put the ID of any user.');

                msg.channel.send(embed);
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
            const embed = getErrorEmbed();

            embed.setTitle('Uh oh!');
            embed.setDescription(
                "Please make sure to check the permissions between you and the user you're trying to ban. It seems like they have a higher role than you."
            );

            msg.channel.send(embed);
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
                    const embed = getSuccessEmbed();

                    embed.setTitle('Success!');
                    embed.setDescription(member.user.username + ' has been banned.');

                    msg.channel.send(embed);
                    return;
                })
                .catch((e) => {
                    console.error(e);
                });
        } else {
            const embed = getErrorEmbed();

            embed.setTitle('Uh oh!');
            embed.setDescription(
                "Please make sure to check the permissions between me and the user, it seems like I don't have permission to ban them."
            );

            msg.channel.send(embed);
            return;
        }
    },
});

interface BanArgs {
    member: GuildMember;
    time?: string;
    reason?: string;
}
