import axios from 'axios';
import { MessageEmbed } from 'discord.js';
import { truncate } from 'lodash';
import { client } from '../../app';
import { ICommand } from '../../types/commands';
import { argumentList } from '../../util/arguments';
import { URL_DATA } from '../../util/axios';
import { getPrefix } from '../../util/db/prefix';
import { messageReply } from '../../util/interactions/message';

const MESSAGES = {
    DESC_NOT_FOUND:
        "Uh oh! I can't find the command description.\n\nYou should let the developers know.\n\n[Our Discord Server.](https://ferris.gg/discord)",
};

client.commands.set('help', {
    name: 'help',
    arguments: [
        {
            name: 'command',
            type: 'command',
            lowercase: true,
            required: false,
        },
    ],
    run: async (msg, args: HelpArgs, guild) => {
        if (!guild) return;

        if (!args.command) {
            await axios.post(
                '/discord/help',
                {
                    guild_id: guild.id,
                    channel: msg.channel.id,
                },
                URL_DATA
            );
            return;
        }

        let embed = new MessageEmbed();
        const prefix = await getPrefix(guild.id);
        embed.setColor(16646143);
        embed.setTitle('**Need help using Ferris?** <:Ferris:843674766976221194>');
        embed.setTitle(`\`${prefix}${args.command.name}\` documentation:`);
        if (!!args.command.description) {
            embed.setDescription(
                truncate(args.command.description, { length: 500 }) +
                    '\n\n' +
                    '[Learn more about this command on our documentation](https://ferris.gg/docs/) <:FerrisShare:843677559953948675>'
            );
        } else {
            embed.setDescription(MESSAGES.DESC_NOT_FOUND);
        }
        embed.setFooter('Thanks for using Ferris!').setTimestamp();
        embed.setThumbnail(
            `https://cdn.ferris.gg/img/commands/${
                args.command.iconName || args.command.name || 'placeholder-crystal'
            }.png`
        );

        messageReply(msg.channel, embed);
    },
    description:
        'The help command tells you everything you need to know about Ferris and how to use the program. You can also use `help <command>` to get information (like this description now) on the specific command.\n\nMore information about the commands can be found on the [Ferris website](https://ferris.gg/docs).',
});

interface HelpArgs {
    command?: ICommand;
}
