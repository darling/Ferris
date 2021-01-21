import { client } from '../app';

import { Guild, MessageEmbed } from 'discord.js';
import { newLog } from '../util/webhookLogging';
import { EmbedColors } from '../util/embed';

client.on('messageDelete', async (msg) => {
    if (!msg.author || msg.author.bot) return;

    if (msg.channel.type === 'dm' || msg.channel.type === 'news') return;

    const guild: Guild | null = msg.guild;
    if (guild === null) return;

    const embed = new MessageEmbed();

    embed.setTitle(`${msg.author.username} has deleted a message.`);
    embed.setTimestamp();
    embed.setFooter(`ID: ${msg.author.id}`);
    embed.setColor(EmbedColors.RED);
    embed.setDescription(msg.content);

    if (msg.attachments.size) {
        embed.addField(
            'Added File',
            msg.attachments
                .array()
                .map((entry) => `**${entry.name}**: [link](${entry.url})\nId: ${entry.id}`)
        );
    }

    await newLog('MESSAGE_DELETED', guild.id, embed);
});
