import { client } from '../app';

import { Guild, MessageEmbed } from 'discord.js';
import { newLog } from '../util/webhookLogging';

client.on('messageDelete', async (msg) => {
    if (!msg.author || msg.author.bot) return;

    if (msg.channel.type === 'dm' || msg.channel.type === 'news') return;

    const guild: Guild | null = msg.guild;
    if (guild === null) return;

    await newLog(
        'MESSAGE_DELETED',
        guild.id,
        new MessageEmbed({
            author: { name: `${msg.author.tag} ID: ${msg.author.id}` },
            title: `Message deleted by ${msg.author.username}`,
            description: `${msg.content}`,
        })
    );
});
