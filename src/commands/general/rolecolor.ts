import { GuildMember, Role } from 'discord.js';
import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { errorEmbed, missingParamEmbed } from '../../util/embedTemplates';

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
                missingParamEmbed(
                    msg.channel,
                    'Please mention or put the ID of the role you would like to edit.'
                );
            },
        },
        {
            name: 'color',
            type: 'string',
            required: true,
            missing: (msg) => {
                missingParamEmbed(
                    msg.channel,
                    'Please put the hex code of the color you would like to change the color to.'
                );
            },
        },
    ],
    guildOnly: true,
    run: (msg, args: RemoveroleArgs, guild) => {
        if (!msg.member || !guild) return;
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
                'Please make sure you have permissions to edit this specific role!'
            );
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
