import { Role, TextChannel } from 'discord.js';
import { client } from '../../../app';
import { PermissionLevels } from '../../../types/commands';
import { updateProperty } from '../../../util/db/config';
import { getErrorEmbed, getSuccessEmbed } from '../../../util/embedTemplates';

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
            updateProperty(guild.id, {
                auto_role: undefined,
            });
            return;
        }
        if (args.role.editable) {
            updateProperty(guild.id, {
                auto_role: args.role.id,
            });

            const embed = getSuccessEmbed();
            embed.setDescription(
                'Any new members will be assigned the <@&' + args.role + '> role from now on.'
            );
            msg.channel.send(embed);
        } else {
            const embed = getErrorEmbed();

            embed.setTitle('Uh oh!');
            embed.setDescription(
                'Unable to manage this role, how will I be able to use this for the auto-member role? Please check my permissions.'
            );
        }
    },
});

interface AutoRoleArgs {
    role?: Role;
}
