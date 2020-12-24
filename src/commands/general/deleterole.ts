import { Role } from 'discord.js';
import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { errorEmbed, getSuccessEmbed, missingParamEmbed } from '../../util/embedTemplates';
import { messageReply } from '../../util/interactions/message';

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
                const embed = getSuccessEmbed();

                embed.setTitle('Success!');
                embed.setDescription('Deleted <@&' + role + '>! (' + role.name + ');');

                messageReply(msg.channel, embed);
            })
            .catch((reason) => {
                console.error(reason);
            });
    },
});

interface CreateRoleArgs {
    role: Role;
}
