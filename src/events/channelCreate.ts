import { Guild, MessageEmbed } from 'discord.js';
import { client } from '../app';
import { IDatabaseSchema, ILoggingProps } from '../util/databaseFunctions';
import { getLoggingProps } from '../util/db/config';
import { serverConfigs } from '../util/serverInfo';
import { isLoggable, newLog } from '../util/webhookLogging';

client.on('channelCreate', async (channel) => {
    if (channel.type === 'dm' || channel.type === 'unknown') return;

    const guild: Guild = (channel as any).guild;
    // updateChannel(guild.id, channel);

    let loggingProps: ILoggingProps | undefined = getLoggingProps(guild.id);
    if (isLoggable('CHANNEL_CREATED', guild.id) || !loggingProps) return;

    const embed = new MessageEmbed();

    embed.setDescription(`<#${channel.id}> has been created.`);
    embed.setTimestamp();
    embed.setFooter(`ID: ${channel.id}`);
    embed.setColor(6869905);
    embed.setTitle('Channel Created');

    await newLog(guild.id, embed);
});
