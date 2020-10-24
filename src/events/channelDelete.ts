import { Guild, MessageEmbed } from 'discord.js';
import { client } from '../app';
import { IDatabaseSchema, ILoggingProps } from '../util/databaseFunctions';
import { getLoggingProps } from '../util/db/config';
import { serverConfigs } from '../util/serverInfo';
import { isLoggable, newLog } from '../util/webhookLogging';

client.on('channelDelete', async (channel) => {
    if (channel.type === 'dm' || channel.type === 'unknown') return;

    const guild: Guild = (channel as any).guild;
    // deleteChannel(guild.id, channel);

    let loggingProps: ILoggingProps | undefined = getLoggingProps(guild.id);
    if (isLoggable('CHANNEL_DELETED', guild.id) || !loggingProps) return;

    const embed = new MessageEmbed();

    embed.setDescription(`<#${channel.id}> has been deleted.`);
    embed.setTimestamp();
    embed.setFooter(`ID: ${channel.id}`);
    embed.setColor(16548225);
    embed.setTitle('Channel Deleted');

    await newLog(guild.id, embed);
});
