import { MessageEmbed } from 'discord.js';
import { client } from '../../app';
import { ICommand } from '../../types/commands';
import { argumentList } from '../../util/arguments';
import { getPrefix } from '../../util/db/prefix';
import { messageReply } from '../../util/interactions/message';

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
        let embed = new MessageEmbed();
        const prefix = await getPrefix(guild.id);
        embed.setColor(16646143);
        embed.setTitle('> **Need help using Ferris?** <:Ferris:766800169420324915>');
        if (args.command) {
            embed.setTitle(`Command \`${prefix}${args.command.name}\` documentation:`);
            let argumentNamesFormatted = '';
            let exampleArgs = `${prefix}${args.command.name}`;
            let description = '';
            if (args.command.aliases) {
                description += `Aliases:\nThis command can also be run with the alias:`;
                args.command.aliases.forEach((alias) => {
                    description += ` \`${prefix}${alias}\``;
                });
                description += `\n\n`;
            }
            if (args.command.arguments) {
                description += `Types:\n`;
                args.command.arguments?.forEach((command) => {
                    argumentNamesFormatted += ` <${command.name}>`;
                    exampleArgs += ` ${argumentList.get(command.type || 'string')?.example()}`;
                    description += `**__${command.name}:__** \`${command.type}\`\n`;
                    if (command.required) {
                        description += `This argument is **required**.\n`;
                    }
                    if (command.literals) {
                        description += `This argument can only choose between the following options:${command.literals.map(
                            (literal) => ` \`${literal}\``
                        )}\n`;
                    }
                });
            }
            embed.setDescription(
                `Inputs:\n\`\`\`${prefix}${args.command.name}${argumentNamesFormatted}\`\`\`\nExample Command:\n\`\`\`${exampleArgs}\`\`\`*[why do I see weird numbers in the example?](https://www.swipetips.com/how-to-find-your-discord-user-id/)*\n\n${description}`
            );
        } else {
            embed.setDescription(
                `Ferris is a high-caliber moderation bot used to improve Discord servers and help communities stay safe.\n\nThis server's prefix is \`${prefix}\`. \n\nPlease make sure to check out our links in order to learn more about Ferris!`
            );
            embed.addField(
                'Get help with Ferris',
                'https://ferris.gg/docs/commands\nhttps://ferris.gg/\n',
                false
            );
            embed.addField('Use Ferris in your own server', 'https://ferris.gg/add\n', false);
            embed.addField(
                'Join our Discord Support Server!',
                'Our server offers personalized help from the developers on advice for your discord and working with the bot. \n\nhttps://ferris.gg/discord',
                false
            );
        }
        embed.setThumbnail(`https://i.imgur.com/owBJxsP.png`);
        embed.setAuthor(msg.author.tag, msg.author.avatarURL()!).setTimestamp();
        messageReply(msg.channel, embed);
    },
});

interface HelpArgs {
    command?: ICommand;
}
