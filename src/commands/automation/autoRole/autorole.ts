import { Role, TextChannel } from 'discord.js';
import { client } from '../../../app';
import { PermissionLevels } from '../../../types/commands';
import { updateProperty } from '../../../util/db/config';
import { errorEmbed, getSuccessEmbed } from '../../../util/embedTemplates';
import { messageReply } from '../../../util/interactions/message';

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
                auto_role: '',
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

            messageReply(msg.channel, embed);
        } else {
            errorEmbed(
                msg.channel,
                'Unable to manage this role, how will I be able to use this for the auto-member role? Please check my permissions.'
            );
        }
    },
});

interface AutoRoleArgs {
    role?: Role;
}
