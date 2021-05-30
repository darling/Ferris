import { GuildMember, Role } from 'discord.js';
import { client } from '../../app';
import { errorEmbed, missingParamEmbed, successEmbed } from '../../util/embedTemplates';

client.commands.set('setrole', {
    name: 'setrole',
    aliases: ['sr'],
    userGuildPerms: ['MANAGE_MESSAGES'],
    botGuildPerms: ['MANAGE_MESSAGES'],
    arguments: [
        {
            name: 'member',
            type: 'member',
            required: true,
            missing: (msg) => {
                missingParamEmbed(
                    msg.channel,
                    'Please mention or put the ID of the member you would like to give a role!'
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
                    'Please mention or put the ID of the role you would like to assign!'
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
            .add(args.role)
            .then((member) => {
                successEmbed(msg.channel, 'Was able to give the role to the user.');
            })
            .catch((e) => {
                errorEmbed(msg.channel, 'Error, please contact the Ferris Staff!');
            });
    },
    iconName: 'add',
    description:
        'This command allows you to **assign a member** a specified __role(s).__  This applies a **role to a user** using a command __without needing to manually do it. __',
});

interface SetroleArgs {
    member: GuildMember;
    role: Role;
}
