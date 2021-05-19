import { Role } from 'discord.js';
import { client } from '../../../app';
import { updateProperty } from '../../../util/db/config';
import { errorEmbed, successEmbed } from '../../../util/embedTemplates';

client.commands.set('muterole', {
    name: 'muterole',
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
    run: (msg, args: MuteRoleArgs, guild) => {
        if (!guild) return;
        if (!args.role) {
            updateProperty(guild.id, {
                muted_role: '',
            });
            return;
        }
        if (args.role.editable) {
            updateProperty(guild.id, {
                muted_role: args.role.id,
            });

            successEmbed(
                msg.channel,
                'Any muted members will be assigned the <@&' + args.role + '> role from now on.'
            );
        } else {
            errorEmbed(
                msg.channel,
                'Unable to manage this role, how will I be able to use this for the mute role? Please check my permissions.'
            );
        }
    },
    iconName: 'mute',
});

interface MuteRoleArgs {
    role?: Role;
}
