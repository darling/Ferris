import { client } from '../app';

import { Guild, MessageEmbed } from 'discord.js';
import { isLoggable, newLog } from '../util/webhookLogging';
import { IDatabaseSchema, ILoggingProps } from '../util/databaseFunctions';
import { serverConfigs } from '../util/serverInfo';
import { getLoggingProps } from '../util/db/config';

client.on('messageDelete', async (msg) => {
    if (!msg.author || msg.author.bot) return;

    if (msg.channel.type === 'dm' || msg.channel.type === 'news') return;

    const guild: Guild | null = msg.guild;
    if (guild === null) return;

    let loggingProps: ILoggingProps | undefined = getLoggingProps(guild.id);
    if (isLoggable('MESSAGE_DELETED', guild.id) || !loggingProps) return;

    await newLog(
        guild.id,
        new MessageEmbed({
            author: { name: `${msg.author.tag} ID: ${msg.author.id}` },
            title: `Message deleted by ${msg.author.username}`,
            description: `${msg.content}`,
        })
    );
});
