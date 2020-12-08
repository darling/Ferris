import { Guild, GuildChannel, MessageEmbed } from 'discord.js';
import { client } from '../app';
import { updateChannel } from '../util/db/channels';
import { newLog } from '../util/webhookLogging';

client.on('channelCreate', async (channel) => {
    if (channel.type === 'dm' || channel.type === 'unknown') return;

    const guild: Guild = (channel as GuildChannel).guild;
    updateChannel(guild.id, channel as GuildChannel);

    const embed = new MessageEmbed();

    embed.setDescription(`<#${channel.id}> has been created.`);
    embed.setTimestamp();
    embed.setFooter(`ID: ${channel.id}`);
    embed.setColor(6869905);
    embed.setTitle('Channel Created');

    await newLog('CHANNEL_CREATED', guild.id, embed);
});
