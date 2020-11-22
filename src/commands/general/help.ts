import { MessageEmbed } from 'discord.js';
import { client } from '../../app';
import { ICommand } from '../../types/commands';

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
    run: (msg, args: HelpArgs) => {
        let embed = new MessageEmbed();
        embed.setColor(16646143);
        embed.setTitle('Help');
        if (args.command) {
            embed.setTitle('`' + args.command['name'] + '` command:');
            let argumentList = '';
            args.command.arguments?.forEach((command) => {
                argumentList += ` <${command.type}>`;
            });
            embed.setDescription(`\`\`\`${args.command.name + argumentList}\`\`\``);
        } else {
            embed.setDescription(
                "If you'd like information on the bot, please check out our websites."
            );
            embed.addField('Documentation', 'https://ferris.gg/docs', false);
            embed.addField('Website', 'https://ferris.gg/', false);
            embed.addField('Patreon', 'https://www.patreon.com/FerrisBot', false);
            embed.addField(
                'Join our Discord Support Server!',
                'Our server offers personalized help from the developers on advice for your discord and working with the bot. \n[Discord Invite Here](https://ferris.gg/discord)',
                false
            );
        }
        embed.setThumbnail(`https://i.imgur.com/owBJxsP.png`);
        embed.setAuthor(msg.author.tag, msg.author.avatarURL()!).setTimestamp();
        msg.channel.send(embed).catch((err: Error) => {
            console.error(err);
        });
    },
});

interface HelpArgs {
    command?: ICommand;
}
