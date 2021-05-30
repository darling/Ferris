import { client } from '../../app';
import { missingParamEmbed, successEmbed } from '../../util/embedTemplates';

client.commands.set('createrole', {
    name: 'createrole',
    aliases: ['cr'],
    arguments: [
        {
            name: 'roleName',
            type: 'string',
            missing: (msg) => {
                missingParamEmbed(msg.channel, 'Please make sure to input a name for the role.');
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
                    successEmbed(msg.channel, 'Created <@&' + role + '>!');
                });
        } catch (e) {
            console.error(e);
            return;
        }
    },
    iconName: 'add',
    description:
        'This command simply **creates** a new role with __no__ additional permissions. This command is great for **setting up roles** and making them __on the go. __',
});

interface CreateRoleArgs {
    roleName: string;
    color: string;
}
