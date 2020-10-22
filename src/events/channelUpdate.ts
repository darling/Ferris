import { Guild } from 'discord.js';
import { client } from '../app';

client.on('channelUpdate', async (oldchannel, channel) => {
    const guild: Guild = (channel as any).guild;
    // updateChannel(guild.id, channel);
});
