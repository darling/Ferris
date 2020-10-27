import { Role, TextChannel } from 'discord.js';
import { client } from '../../../app';
import { PermissionLevels } from '../../../types/commands';
import { updateProperty } from '../../../util/db/config';
import { getSuccessEmbed } from '../../../util/embedTemplates';

client.commands.set('autorole', {
    name: 'autorole',
    arguments: [
        {
            name: 'role',
            type: 'role',
            required: true,
        },
    ],
    // botGuildPerms: ['MANAGE_ROLES'],
    // userGuildPerms: ['MANAGE_ROLES'],
    guildOnly: true,
    run: (msg, args: AutoRoleArgs, guild) => {
        if (!guild) return;
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
            // Insert case of: not being able to manage the specific role.
        }
    },
});

interface AutoRoleArgs {
    role: Role;
}
