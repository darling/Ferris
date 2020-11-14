import { GuildMember } from 'discord.js';
import { client } from '../../app';
import { getErrorEmbed, getSuccessEmbed } from '../../util/embedTemplates';

client.commands.set('kick', {
    name: 'kick',
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
        {
            name: 'reason',
            type: '...string',
            required: false,
        },
    ],
    guildOnly: true,
    botGuildPerms: ['KICK_MEMBERS'],
    userGuildPerms: ['KICK_MEMBERS'],
    run: (msg, args: Args, guild) => {
        if (!(msg.member!.roles.highest.comparePositionTo(args.member.roles.highest) > 0)) {
            const embed = getErrorEmbed();

            embed.setTitle('Uh oh!');
            embed.setDescription(
                "Please make sure to check the permissions between you and the user you're trying to kick. It seems like they have a higher role than you."
            );

            msg.channel.send(embed);
            return;
        }
        if (args.member.kickable) {
            args.member
                .kick(msg.author.id + ' kicked ' + (args.reason || 'Kicked by the kick command'))
                .then((member) => {
                    const embed = getSuccessEmbed();

                    embed.setTitle('Success!');
                    embed.setDescription(member.user.username + ' has been kicked.');

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
                "Please make sure to check the permissions between me and the user, it seems like I don't have permission to kick them."
            );

            msg.channel.send(embed);
            return;
        }
    },
});

interface Args {
    member: GuildMember;
    reason?: string;
}
