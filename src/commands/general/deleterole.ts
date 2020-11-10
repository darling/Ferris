import { Role } from 'discord.js';
import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { getErrorEmbed, getSuccessEmbed, missingParamEmbed } from '../../util/embedTemplates';

client.commands.set('deleterole', {
    name: 'deleterole',
    aliases: ['dr'],
    arguments: [
        {
            name: 'role',
            type: 'role',
            missing: (msg) => {
                const embed = missingParamEmbed(
                    'Please make sure to mention or put the id of any role.'
                );
                msg.channel.send(embed);
            },
        },
    ],
    guildOnly: true,
    userGuildPerms: ['MANAGE_ROLES'],
    botGuildPerms: ['MANAGE_ROLES'],
    run: (msg, args: CreateRoleArgs, guild) => {
        if (!guild || !msg.member) return;
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
        args.role
            .delete('Requested through removerole')
            .then((role) => {
                const embed = getSuccessEmbed();

                embed.setTitle('Success!');
                embed.setDescription('Deleted <@&' + role + '>! (' + role.name + ');');

                msg.channel.send(embed);
            })
            .catch((reason) => {
                console.error(reason);
            });
    },
});

interface CreateRoleArgs {
    role: Role;
}
