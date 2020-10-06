import { Guild, MessageEmbed } from 'discord.js';
import { client } from '../app';
import { deleteChannel, IDatabaseSchema } from '../util/databaseFunctions';
import { serverConfigs } from '../util/serverInfo';
import { isLoggable, newLog } from '../util/webhookLogging';

client.on('channelDelete', async (channel) => {
    if (channel.type === 'dm' || channel.type === 'unknown') return;

    const guild: Guild = (channel as any).guild;
    deleteChannel(guild.id, channel);

    let guildConfig: IDatabaseSchema | undefined = serverConfigs.get(guild.id);
    if (isLoggable('CHANNEL_DELETED', guild.id) || !guildConfig || !guildConfig.logging) return;

    const embed = new MessageEmbed();

    embed.setDescription(`<#${channel.id}> has been deleted.`);
    embed.setTimestamp();
    embed.setFooter(`ID: ${channel.id}`);
    embed.setColor(16548225);
    embed.setTitle('Channel Deleted');

    await newLog(guild.id, embed);
});
