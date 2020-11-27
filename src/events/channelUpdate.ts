import { Guild, GuildChannel } from 'discord.js';
import { client } from '../app';
import { updateChannel } from '../util/db/channels';

client.on('channelUpdate', async (oldchannel, channel) => {
    const guild: Guild = (channel as any).guild;
    updateChannel(guild.id, channel as GuildChannel);
});
