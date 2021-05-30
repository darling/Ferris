import { Collection, Role } from 'discord.js';

import { client } from '../../../app';
import { ICommand } from '../../../types/commands';
import { appendProperty, removeProperty } from '../../../util/db/config';
import { errorEmbed } from '../../../util/embedTemplates';

const selfRoleSubCommands = new Collection<string, ICommand>();

client.commands.set('selfrole', {
    name: 'selfrole',
    aliases: ['selfroles', 'self'],
    arguments: [
        {
            name: 'action',
            type: 'subcommand',
            required: true,
            missing: (msg) => {
                errorEmbed(msg.channel, 'Please specify an action.');
            },
        },
    ],
    botGuildPerms: ['MANAGE_ROLES', 'MANAGE_GUILD'],
    userGuildPerms: ['MANAGE_ROLES', 'MANAGE_GUILD'],
    guildOnly: true,
    iconName: 'role',
    description: 'Add or Remove roles that users can assign to themselves',
    subcommands: selfRoleSubCommands,
});

selfRoleSubCommands.set('add', {
    name: 'add',
    arguments: [
        {
            name: 'role',
            type: 'role',
            description: 'The role that will be set that users can give to themselves.',
            missing: (msg) => {
                errorEmbed(msg.channel, 'Please specify an action.');
            },
            required: true,
        },
    ],
    aliases: ['a', 'set'],
    description: 'This action will add roles to the selfrole list.',
    botGuildPerms: ['MANAGE_ROLES', 'MANAGE_GUILD'],
    userGuildPerms: ['MANAGE_ROLES', 'MANAGE_GUILD'],
    run: async (msg, args: { role: Role }, guild) => {
        if (!guild || !guild.me) return;
        if (args.role.managed || args.role.comparePositionTo(guild.me.roles.highest) > 0) {
            errorEmbed(msg.channel, 'I can not manage this role.');
            return;
        }
        await appendProperty(guild.id, 'selfrole', [args.role.id]);
    },
});

selfRoleSubCommands.set('remove', {
    name: 'remove',
    arguments: [
        {
            name: 'role',
            type: 'role',
            description: 'The role that will be removed from the selfrole list.',
            missing: (msg) => {
                errorEmbed(msg.channel, 'Please specify an action.');
            },
            required: true,
        },
    ],
    aliases: ['r', 'd', 'del', 'rem'],
    description: 'This action will remove roles from the selfrole list.',
    botGuildPerms: ['MANAGE_ROLES', 'MANAGE_GUILD'],
    userGuildPerms: ['MANAGE_ROLES', 'MANAGE_GUILD'],
    run: async (msg, args: { role: Role }, guild) => {
        if (!guild) return;
        await removeProperty(guild.id, 'selfrole', [args.role.id]);
    },
});
