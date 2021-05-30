import { Role } from 'discord.js';
import { client } from '../../../app';
import { deleteProperty, updateProperty } from '../../../util/db/config';
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
            deleteProperty(guild.id, 'muted_role');
            successEmbed(msg.channel, 'There is no longer a muted role :)');
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
    description:
        'This command allows you to assign a **mute role** to the `mute` command. This role will __prevent__ them from messaging in chats, hence, muting them. ',
});

interface MuteRoleArgs {
    role?: Role;
}
