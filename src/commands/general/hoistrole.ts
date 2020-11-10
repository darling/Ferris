import { Role } from 'discord.js';
import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { getErrorEmbed, getSuccessEmbed, missingParamEmbed } from '../../util/embedTemplates';

client.commands.set('hoistrole', {
    name: 'hoistrole',
    arguments: [
        {
            name: 'role',
            type: 'role',
            missing: (msg) => {
                const embed = missingParamEmbed('Please make sure to input a role.');
                msg.channel.send(embed);
            },
        },
    ],
    permissionLevels: [PermissionLevels.BOT_DEV],
    run: (msg, args: Args, guild) => {
        if (!guild || !msg.member) return;
        if (!args.role.editable) {
            const embed = getErrorEmbed();

            embed.setDescription('Please make sure that I can edit this role!');
            embed.setTitle('Error!');

            msg.channel.send(embed);
            return;
        }
        if (
            msg.member.roles.highest.comparePositionTo(args.role) <= 0 &&
            guild.ownerID !== msg.member.id
        ) {
            const embed = getErrorEmbed();

            embed.setDescription(
                'Please make sure you have permissions to edit this specific role!'
            );
            embed.setTitle('Error!');

            msg.channel.send(embed);
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

                msg.channel.send(embed);
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
