import { Guild, GuildChannel, MessageEmbed } from 'discord.js';
import { client } from '../app';
import { updateChannel } from '../util/db/channels';
import { newLog } from '../util/webhookLogging';

client.on('channelDelete', async (channel) => {
    if (channel.type === 'dm' || channel.type === 'unknown') return;

    const guild: Guild = (channel as GuildChannel).guild;
    updateChannel(guild.id, channel as GuildChannel);

    const embed = new MessageEmbed();

    embed.setDescription(`<#${channel.id}> has been deleted.`);
    embed.setTimestamp();
    embed.setFooter(`ID: ${channel.id}`);
    embed.setColor(16548225);
    embed.setTitle('Channel Deleted');

    await newLog('CHANNEL_DELETED', guild.id, embed);
});
