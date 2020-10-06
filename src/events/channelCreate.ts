import { Guild, MessageEmbed } from 'discord.js';
import { client } from '../app';
import { IDatabaseSchema, updateChannel } from '../util/databaseFunctions';
import { serverConfigs } from '../util/serverInfo';
import { isLoggable, newLog } from '../util/webhookLogging';

client.on('channelCreate', async (channel) => {
    if (channel.type === 'dm' || channel.type === 'unknown') return;

    const guild: Guild = (channel as any).guild;
    updateChannel(guild.id, channel);

    let guildConfig: IDatabaseSchema | undefined = serverConfigs.get(guild.id);
    if (isLoggable('CHANNEL_CREATED', guild.id) || !guildConfig || !guildConfig.logging) return;

    const embed = new MessageEmbed();

    embed.setDescription(`<#${channel.id}> has been created.`);
    embed.setTimestamp();
    embed.setFooter(`ID: ${channel.id}`);
    embed.setColor(6869905);
    embed.setTitle('Channel Created');

    await newLog(guild.id, embed);
});
