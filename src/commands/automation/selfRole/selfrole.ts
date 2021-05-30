import axios from 'axios';
import { Collection, MessageEmbed, Role } from 'discord.js';

import { client } from '../../../app';
import { ICommand } from '../../../types/commands';
import { URL_DATA } from '../../../util/axios';
import { appendProperty, getConfig, removeProperty } from '../../../util/db/config';
import { EmbedColors, sendSimpleEmbed } from '../../../util/embed';
import { errorEmbed, successEmbed } from '../../../util/embedTemplates';
import { messageReply } from '../../../util/interactions/message';

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
    guildOnly: true,
    iconName: 'role',
    description:
        'Add or Remove roles that users can assign to themselves. You can use `;selfrole add | remove | list | display` to add, remove, list, and display the roles.\n\nDisplay gives a button that users can use to get the roles themselves without any commands at all.',
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
                errorEmbed(msg.channel, 'Please specify a role.');
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
        successEmbed(msg.channel, `**${args.role.name}** is added to the selfrole list.`);
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
                errorEmbed(msg.channel, 'Please specify a role.');
            },
            required: true,
        },
    ],
    aliases: ['r', 'del', 'rem'],
    description: 'This action will remove roles from the selfrole list.',
    botGuildPerms: ['MANAGE_ROLES', 'MANAGE_GUILD'],
    userGuildPerms: ['MANAGE_ROLES', 'MANAGE_GUILD'],
    run: async (msg, args: { role: Role }, guild) => {
        if (!guild) return;
        await removeProperty(guild.id, 'selfrole', [args.role.id]);
        successEmbed(msg.channel, `**${args.role.name}** is removed from the selfrole list.`);
    },
});

selfRoleSubCommands.set('list', {
    name: 'list',
    arguments: [],
    aliases: ['l'],
    description: 'This action will list roles from the selfrole list.',
    run: async (msg, _args, guild) => {
        if (!guild) return;
        const config = await getConfig(guild.id);
        const embed = new MessageEmbed();

        embed.setColor(EmbedColors.WHITE);
        embed.setTitle('Self Role List');
        embed.setTimestamp();

        let description = '';

        if (config?.selfrole)
            for (const id of config.selfrole) {
                const r = await guild.roles.fetch(id);
                description += `\n${r?.name} (<@&${r?.id}>)`;
            }

        embed.setDescription(description || 'No roles at all');

        messageReply(msg.channel, embed);
    },
});

const display: ICommand = {
    name: 'display',
    arguments: [
        {
            name: 'role',
            type: 'role',
            description: 'The role that will be on display.',
            missing: (msg) => {
                errorEmbed(msg.channel, 'Please specify a role.');
            },
            required: true,
        },
    ],
    aliases: ['d'],
    description:
        'This will list a role dialogue from the selfrole list that users can use to get the role without typing any commands.',
    botGuildPerms: ['MANAGE_ROLES', 'MANAGE_GUILD'],
    userGuildPerms: ['MANAGE_ROLES', 'MANAGE_GUILD'],
    run: async (msg, args: { role: Role }, guild) => {
        if (!guild) return;
        await axios.post(
            '/discord/display',
            {
                guild_id: guild.id,
                role_id: args.role.id,
                role_name: args.role.name,
                channel: msg.channel.id,
            },
            URL_DATA
        );
    },
};

selfRoleSubCommands.set('display', display);
client.commands.set('display', display);
