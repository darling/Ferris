import { MessageEmbed } from 'discord.js';
import { client } from '../../app';
import { EmbedColors } from '../../util/embed';

client.commands.set('invite', {
    name: 'invite',
    arguments: [],
    run: (msg) => {
        const embed = new MessageEmbed();

        embed.setColor(EmbedColors.WHITE)
        embed.setTimestamp()
        embed.setTitle('Thank you for wanting to use Ferris!')
        embed.setDescription('You can add Ferris to your own server by using [this link](https://discord.com/oauth2/authorize?client_id=637804742935838751&permissions=2134207679&scope=bot).')

        msg.channel.send(embed).catch(() => {});
    },
});
