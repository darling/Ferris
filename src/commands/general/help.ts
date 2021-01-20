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
        embed.setColor(16646143);
        embed.setTitle('Help');
        if (args.command) {
            const prefix = await getPrefix(guild.id);
            embed.setTitle(`Command \`${prefix}${args.command.name}\` documentation:`);
            let argumentNamesFormatted = '';
            let exampleArgs = `${prefix}${args.command.name}`;
            let description = '';
            let permissions = '';
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
                "If you'd like information on the bot, please check out our websites."
            );
            embed.addField('Commands', 'https://ferris.gg/docs/commands', false);
            embed.addField('Website', 'https://ferris.gg/', false);
            embed.addField(
                'Join our Discord Support Server!',
                'Our server offers personalized help from the developers on advice for your discord and working with the bot. \n[Discord Invite Here](https://ferris.gg/discord)',
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
