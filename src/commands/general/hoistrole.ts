import { Role } from 'discord.js';
import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { errorEmbed, getSuccessEmbed, missingParamEmbed } from '../../util/embedTemplates';
import { messageReply } from '../../util/interactions/message';

client.commands.set('hoistrole', {
    name: 'hoistrole',
    arguments: [
        {
            name: 'role',
            type: 'role',
            missing: (msg) => {
                missingParamEmbed(msg.channel, 'Please make sure to input a role.');
            },
        },
    ],
    permissionLevels: [PermissionLevels.BOT_DEV],
    run: (msg, args: Args, guild) => {
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
                'Please make sure you have specific permissions to edit this role!'
            );
            return;
        }
        args.role
            .setHoist(!args.role.hoist, 'Triggered through ;hoistrole command')
            .then((role) => {
                const embed = getSuccessEmbed();

                embed.setTitle('Success!');
                embed.setDescription(
                    'Successfully set the hoist property for <@&' + role.id + '>.'
                );

                messageReply(msg.channel, embed);
                return;
            })
            .catch((e) => {
                console.error(e);
            });
    },
});

interface Args {
    role: Role;
}
