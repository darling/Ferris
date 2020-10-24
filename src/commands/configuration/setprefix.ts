import { MessageEmbed } from 'discord.js';
import { db } from '../../app';

import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { getConfig, updateProperty } from '../../util/db/config';
import { changePrefix } from '../../util/db/prefix';
import { serverConfigs } from '../../util/serverInfo';

client.commands.set('setprefix', {
    name: 'setprefix',
    aliases: ['prefix'],
    guildOnly: true,
    arguments: [
        {
            name: 'newPrefix',
            type: 'string',
            required: false,
        },
    ],
    permissionLevels: [
        PermissionLevels.ADMIN,
        PermissionLevels.SERVER_OWNER,
        PermissionLevels.BOT_DEV,
    ],
    userGuildPerms: ['MANAGE_GUILD'],
    run: (msg, args: EchoArgs, guild) => {
        if (!guild) return;

        if (args.newPrefix) {
            changePrefix(guild.id, args.newPrefix);
        }

        const prefix = getConfig(guild.id)?.prefix || ';';

        const embed = new MessageEmbed();

        embed.setDescription(`The prefix is ${args.newPrefix ? 'now ' : ''}${prefix}`);

        msg.channel.send(embed);
    },
});

interface EchoArgs {
    newPrefix?: string;
}
