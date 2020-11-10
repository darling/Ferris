import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { getSuccessEmbed, missingParamEmbed } from '../../util/embedTemplates';

client.commands.set('createrole', {
    name: 'createrole',
    aliases: ['cr'],
    arguments: [
        {
            name: 'roleName',
            type: 'string',
            missing: (msg) => {
                const embed = missingParamEmbed('Please make sure to input a name for the role.');
                msg.channel.send(embed);
            },
        },
        {
            name: 'color',
            type: 'string',
            required: false,
        },
    ],
    guildOnly: true,
    userGuildPerms: ['MANAGE_ROLES'],
    botGuildPerms: ['MANAGE_ROLES'],
    run: (msg, args: CreateRoleArgs, guild) => {
        if (!guild) return;
        try {
            guild.roles
                .create({
                    data: {
                        name: args.roleName,
                        permissions: 0,
                        color: args.color ? parseInt(args.color, 16) : 16777214,
                    },
                    reason: 'Created role using createrole command',
                })
                .then((role) => {
                    const embed = getSuccessEmbed();

                    embed.setTitle('Success!');
                    embed.setDescription('Created <@&' + role + '>!');

                    msg.channel.send(embed);
                });
        } catch (e) {
            console.error(e);
            return;
        }
    },
});

interface CreateRoleArgs {
    roleName: string;
    color: string;
}
