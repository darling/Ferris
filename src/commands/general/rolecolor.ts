import { GuildMember, Role } from 'discord.js';
import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { getErrorEmbed } from '../../util/embedTemplates';

client.commands.set('rolecolor', {
    name: 'rolecolor',
    aliases: ['rc'],
    // userGuildPerms: ['MANAGE_MESSAGES'],
    // botGuildPerms: ['MANAGE_MESSAGES'],
    arguments: [
        {
            name: 'role',
            type: 'role',
            required: true,
            missing: (msg) => {
                msg.reply('Dont forget to add what role you want to take');
            },
        },
        {
            name: 'color',
            type: 'string',
            required: true,
            missing: (msg) => {
                msg.reply('Please make sure to add the color in hex value, ie `FFFFFF`');
            },
        },
    ],
    guildOnly: true,
    run: (msg, args: RemoveroleArgs, guild) => {
        if (!msg.member || !guild) return;
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
            .setColor(args.color, 'Set using the rolecolor command')
            .then((role) => {
                msg.reply('New color set');
            })
            .catch((e) => {
                console.error(e);
            });
    },
});

interface RemoveroleArgs {
    role: Role;
    color: string;
}
