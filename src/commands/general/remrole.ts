import { GuildMember, Role } from 'discord.js';
import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { getErrorEmbed, getSuccessEmbed } from '../../util/embedTemplates';

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
                msg.reply('Dont forget to mention who you cant to give a role to');
            },
        },
        {
            name: 'role',
            type: 'role',
            required: true,
            missing: (msg) => {
                msg.reply('Dont forget to add what role you want to give');
            },
        },
    ],
    guildOnly: true,
    run: (msg, args: SetroleArgs, guild) => {
        if (!msg.member || !guild) return;
        if (!args.role.editable) {
            const embed = getErrorEmbed();

            embed.setDescription('Please make sure that I can edit this role!');
            embed.setTitle('Error!');

            msg.channel.send(embed);
            return;
        }
        if (
            msg.member.roles.highest.comparePositionTo(args.role) <= 0 &&
            guild.ownerID !== msg.member.id
        ) {
            const embed = getErrorEmbed();

            embed.setDescription(
                'Please make sure you have permissions to edit this specific role!'
            );
            embed.setTitle('Error!');

            msg.channel.send(embed);
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
                msg.reply('This failed!');
            });
    },
});

interface SetroleArgs {
    member: GuildMember;
    role: Role;
}
