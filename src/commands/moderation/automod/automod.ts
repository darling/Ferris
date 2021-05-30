import { Collection, MessageEmbed } from 'discord.js';
import { client } from '../../../app';
import { ICommand, PermissionLevels } from '../../../types/commands';
import { sendSimpleEmbed } from '../../../util/embed';
import { missingParamEmbed } from '../../../util/embedTemplates';
import { messageReply } from '../../../util/interactions/message';

export const automodSubCommands = new Collection<string, ICommand>();

client.commands.set('automod', {
    name: 'automod',
    aliases: ['am'],
    arguments: [
        {
            name: 'setting',
            type: 'subcommand',
            required: false,
        },
    ],
    userGuildPerms: ['MANAGE_MESSAGES', 'MANAGE_GUILD'],
    permissionLevels: [PermissionLevels.BOT_DEV],
    run: (msg, _args, guild) => {
        if (!guild) return;

        messageReply(
            msg.channel,
            "Ferris Automoderation doesn't have documentation yet, but hold tight."
        );
    },
    subcommands: automodSubCommands,
    display: false,
    description: 'Manage Automod here',
});
