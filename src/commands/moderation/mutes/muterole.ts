import { Role } from 'discord.js';
import { client } from '../../../app';
import { updateProperty } from '../../../util/db/config';
import { getErrorEmbed, getSuccessEmbed } from '../../../util/embedTemplates';

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

            const embed = getSuccessEmbed();
            embed.setDescription(
                'Any muted members will be assigned the <@&' + args.role + '> role from now on.'
            );
            msg.channel.send(embed);
        } else {
            const embed = getErrorEmbed();

            embed.setTitle('Uh oh!');
            embed.setDescription(
                'Unable to manage this role, how will I be able to use this for the mute role? Please check my permissions.'
            );
        }
    },
});

interface MuteRoleArgs {
    role?: Role;
}
