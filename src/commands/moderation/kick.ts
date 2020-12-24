import { GuildMember } from 'discord.js';
import { client } from '../../app';
import { errorEmbed, successEmbed } from '../../util/embedTemplates';

client.commands.set('kick', {
    name: 'kick',
    arguments: [
        {
            name: 'member',
            type: 'member',
            required: true,
            missing: (msg) => {
                errorEmbed(msg.channel, 'Please make sure to mention or put the ID of any user.');
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
            errorEmbed(
                msg.channel,
                "Please make sure to check the permissions between you and the user you're trying to kick. It seems like they have a higher role than you."
            );
            return;
        }
        if (args.member.kickable) {
            args.member
                .kick(msg.author.id + ' kicked ' + (args.reason || 'Kicked by the kick command'))
                .then((member) => {
                    successEmbed(msg.channel, member.user.username + ' has been kicked.');
                    return;
                })
                .catch((e) => {
                    console.error(e);
                });
        } else {
            errorEmbed(
                msg.channel,
                "Please make sure to check the permissions between me and the user, it seems like I don't have permission to kick them."
            );
            return;
        }
    },
});

interface Args {
    member: GuildMember;
    reason?: string;
}
