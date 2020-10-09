import { Message, MessageEmbed } from 'discord.js';
import { FerrisClient } from '../../app';

import { RunCommand } from '../../util/commandinterface';

const run: RunCommand = function (client: FerrisClient, msg: Message): void {
    let embed = new MessageEmbed();
    embed.setColor(16646143);
    embed.setTitle('Help');
    embed.setDescription("If you'd like information on the bot, please check out our websites.");
    embed.addField('Documentation', 'https://docs.ferrisbot.app/', false);
    embed.addField('Website', 'https://ferrisbot.app/', false);
    embed.addField('Github', 'https://github.com/darling/Ferris', false);
    embed.addField('Patreon', 'https://www.patreon.com/FerrisBot', false);
    embed.addField(
        'Join our Discord Support Server!',
        'Our server offers personalized help from the developers on advice for your discord and working with the bot. \n[Discord Invite Here](https://discord.gg/A3ZjXAn)',
        false
    );
    embed.setThumbnail(`https://i.imgur.com/owBJxsP.png`);
    embed.setAuthor(msg.author.tag, msg.author.avatarURL()!).setTimestamp();
    msg.channel.send(embed).catch((err: Error) => {
        console.error(err);
    });
};

const aliases = ['h'];

export { run, aliases };
