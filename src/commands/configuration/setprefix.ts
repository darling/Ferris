import { MessageEmbed } from 'discord.js';
import { db } from '../../app';

import { client } from '../../app';
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
    run: (msg, args: EchoArgs, guild) => {
        if (!guild) return;

        if (args.newPrefix) {
            db.ref(`guilds/${guild.id}/prefix`).set(args.newPrefix);
        }

        const prefix = serverConfigs.get(guild.id)?.config?.prefix || ';';

        const embed = new MessageEmbed();

        embed.setDescription(`The prefix is ${args.newPrefix ? 'now ' : ''}${prefix}`);

        msg.channel.send(embed);
    },
});

interface EchoArgs {
    newPrefix?: string;
}
