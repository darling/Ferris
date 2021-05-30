import { MessageEmbed } from 'discord.js';
import { client } from '../../app';
import { ICommand } from '../../types/commands';

client.commands.set('privacy', {
    name: 'privacy',
    arguments: [],
    run: (msg) => {
        let embed = new MessageEmbed();
        embed.setColor(16646143);
        embed.setTitle('Privacy');
        embed.setDescription(
            'If you have any questions, comments, concerns about your data and Ferris, please inquire either through our support server, or through email.\n\nPlease contact the respective email for specific concerns.'
        );
        embed.addField('Privacy', 'privacy@ey.lc', false);
        embed.addField('Security', 'security@ey.lc', false);
        embed.addField('Support Server', '[Discord Invite Here](https://ferris.gg/discord)', false); // https://gist.github.com/darling/5b4ee8a5c2a29bd8ea4a9d1cf2ab1b30
        embed.addField(
            'Privacy Policy',
            '[Policy Here](https://gist.github.com/darling/5b4ee8a5c2a29bd8ea4a9d1cf2ab1b30)',
            false
        );
        embed.setThumbnail(`https://i.imgur.com/owBJxsP.png`);
        embed.setAuthor(msg.author.tag, msg.author.avatarURL()!).setTimestamp();
        msg.channel.send(embed).catch((err: Error) => {
            console.error(err);
        });
    },
    description:
        'This command will lead you to the **Ferris privacy policy**. Stay Safe! :shield: ',
});
