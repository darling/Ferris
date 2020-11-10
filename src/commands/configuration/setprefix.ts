import { MessageEmbed } from 'discord.js';
import { client } from '../../app';
import { getConfig } from '../../util/db/config';
import { changePrefix } from '../../util/db/prefix';

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
