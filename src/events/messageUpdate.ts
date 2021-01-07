import { client } from '../app';

// Instead of grabbing the prefix each time, we can store the current prefix of any server this shard looks at, and update it when the database updates.
import { serverConfigs } from '../util/serverInfo';
import { Guild, MessageEmbed } from 'discord.js';
import { ILoggingProps, isLoggable, newLog } from '../util/webhookLogging';
import { getLoggingProps } from '../util/db/config';
import { EmbedColors } from '../util/embed';
import { truncate } from 'lodash';

client.on('messageUpdate', async (msg, newMsg) => {
    if (!msg.author || msg.author.bot) return;

    if (msg.channel.type === 'dm' || msg.channel.type === 'news') return;

    const guild: Guild | null = msg.guild;
    if (guild === null || msg.content === newMsg.content) return;

    const embed = new MessageEmbed();

    embed.setTitle(`${msg.author.username} has deleted a message.`);
    embed.setTimestamp();
    embed.setFooter(`ID: ${msg.author.id}`);
    embed.setColor(EmbedColors.RED);
    embed.setDescription(
        `\`\`\`${truncate(msg.content?.replace(/\`/g, "'"), {
            length: 1900,
        })}\`\`\`\n**to:**\nMessage url of current: [link](${newMsg.url})`
    );

    if (newMsg.attachments.size) {
        embed.addField(
            'Added File',
            newMsg.attachments
                .array()
                .map((entry) => `**${entry.name}**: [link](${entry.url})\nId: ${entry.id}`)
        );
    }

    await newLog('MESSAGE_UPDATED', guild.id, embed);
});
