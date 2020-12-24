import { GuildMember, Role } from 'discord.js';
import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { errorEmbed, getSuccessEmbed, missingParamEmbed } from '../../util/embedTemplates';

client.commands.set('removerole', {
    name: 'removerole',
    aliases: ['rr'],
    userGuildPerms: ['MANAGE_ROLES'],
    botGuildPerms: ['MANAGE_ROLES'],
    arguments: [
        {
            name: 'member',
            type: 'member',
            required: true,
            missing: (msg) => {
                missingParamEmbed(
                    msg.channel,
                    'Please make sure to mention or put the ID of the member you would like to remove a role from.'
                );
            },
        },
        {
            name: 'role',
            type: 'role',
            required: true,
            missing: (msg) => {
                missingParamEmbed(
                    msg.channel,
                    'Please make sure to mention or put the ID of the role you would like to remove.'
                );
            },
        },
    ],
    guildOnly: true,
    run: (msg, args: SetroleArgs, guild) => {
        if (!msg.member || !guild) return;
        if (!args.role.editable) {
            errorEmbed(msg.channel, 'Please make sure that I can edit this role!');
            return;
        }
        if (
            msg.member.roles.highest.comparePositionTo(args.role) <= 0 &&
            guild.ownerID !== msg.member.id
        ) {
            errorEmbed(
                msg.channel,
                'Please make sure you have permissions to edit this specific role!'
            );
            return;
        }
        args.member.roles
            .remove(args.role)
            .then((member) => {
                const embed = getSuccessEmbed();

                embed.setTitle('Success!');
                embed.setDescription('Was able to take the role to the user.');

                msg.channel.send(embed);
            })
            .catch((e) => {
                errorEmbed(
                    msg.channel,
                    'Something went wrong, I am unable to add the role to the member? Please let the Ferris Staff know about this.'
                );
            });
    },
});

interface SetroleArgs {
    member: GuildMember;
    role: Role;
}
