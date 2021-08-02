import { GuildMember } from 'discord.js';
import { client } from '../../app';
import { errorEmbed, successEmbed } from '../../util/embedTemplates';

client.commands.set('unban', {
    name: 'unban',
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
    ],
    // permissionLevels: [PermissionLevels.BOT_DEV],
    botGuildPerms: ['BAN_MEMBERS'],
    userGuildPerms: ['BAN_MEMBERS'],
    run: async (msg, args: BanArgs) => {
        if (!(msg.member!.roles.highest.comparePositionTo(args.member.roles.highest) > 0)) {
            errorEmbed(
                msg.channel,
                "Please make sure to check the permissions between you and the user you're trying to unban. It seems like they have a higher role than you."
            );
            return;
        }
        const bannedUsers = await msg.guild?.fetchBans();
        const user = bannedUsers?.get(args.member.id)?.user;
        if(user) {
            msg.guild?.members.unban(user);
        } else {
            errorEmbed(
                msg.channel,
                "Please make sure that the user you are trying to unban is already in the ban list of the server."
            );
            return;
        }
    },
    iconName: 'law',
    description:
        'Unpunish a user by unbanning him from your guild. This allows him to rejoin at anytime with or without invitation from another user.',
});

interface BanArgs {
    member: GuildMember;
}
