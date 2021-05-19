import { Role } from 'discord.js';
import { client } from '../../app';
import { errorEmbed, missingParamEmbed, successEmbed } from '../../util/embedTemplates';

client.commands.set('deleterole', {
    name: 'deleterole',
    aliases: ['dr'],
    arguments: [
        {
            name: 'role',
            type: 'role',
            missing: (msg) => {
                missingParamEmbed(
                    msg.channel,
                    'Please make sure to mention or put the id of any role.'
                );
            },
        },
    ],
    guildOnly: true,
    userGuildPerms: ['MANAGE_ROLES'],
    botGuildPerms: ['MANAGE_ROLES'],
    run: (msg, args: CreateRoleArgs, guild) => {
        if (!guild || !msg.member) return;
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
        args.role
            .delete('Requested through removerole')
            .then((role) => {
                successEmbed(msg.channel, 'Deleted <@&' + role + '>! (' + role.name + ');');
            })
            .catch((e) => {
                errorEmbed(msg.channel, 'Error. Please contact the Ferris Staff.');
                console.error(e);
            });
    },
    iconName: 'cancel',
});

interface CreateRoleArgs {
    role: Role;
}
