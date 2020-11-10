import { client } from '../app';

// Instead of grabbing the prefix each time, we can store the current prefix of any server this shard looks at, and update it when the database updates.
import { serverConfigs } from '../util/serverInfo';
import { Guild, MessageEmbed } from 'discord.js';
import { IDatabaseSchema, ILoggingProps } from '../util/databaseFunctions';
import { isLoggable, newLog } from '../util/webhookLogging';
import { getLoggingProps } from '../util/db/config';

client.on('messageUpdate', async (msg, newMsg) => {
    if (msg.author?.bot) return;

    if (msg.channel.type === 'dm' || msg.channel.type === 'news') return;

    const guild: Guild | null = msg.guild;
    if (guild === null) return;

    let loggingProps: ILoggingProps | undefined = getLoggingProps(guild.id);
    if (isLoggable('MESSAGE_UPDATED', guild.id) || !loggingProps) return;

    const embed = new MessageEmbed({
        author: { name: `${msg.author?.tag} ID: ${msg.author?.id}` },
        title: `Message edited by ${msg.author?.username}`,
        description: `${msg.content}\n**to:**\n${newMsg.content}`,
    });

    await newLog(guild.id, embed);
});
