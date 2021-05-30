import { Role } from 'discord.js';
import { client } from '../../../app';
import { deleteProperty, updateProperty } from '../../../util/db/config';
import { errorEmbed, successEmbed } from '../../../util/embedTemplates';

client.commands.set('autorole', {
    name: 'autorole',
    arguments: [
        {
            name: 'role',
            type: 'role',
            required: false,
        },
    ],
    botGuildPerms: ['MANAGE_ROLES'],
    userGuildPerms: ['MANAGE_ROLES'],
    guildOnly: true,
    run: (msg, args: AutoRoleArgs, guild) => {
        if (!guild) return;
        if (!args.role) {
            if (!args.role) {
                deleteProperty(guild.id, 'auto_role');
                successEmbed(msg.channel, 'There is no longer a muted role :)');
                return;
            }
            return;
        }
        if (args.role.editable) {
            updateProperty(guild.id, {
                auto_role: args.role.id,
            });

            successEmbed(
                msg.channel,
                'Any new members will be assigned the <@&' + args.role + '> role from now on.'
            );
        } else {
            errorEmbed(
                msg.channel,
                'Unable to manage this role, how will I be able to use this for the auto-member role? Please check my permissions.'
            );
        }
    },
    iconName: 'role',
});

interface AutoRoleArgs {
    role?: Role;
}
