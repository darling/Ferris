import { GuildChannel } from 'discord.js';
import { db } from '../../app';

export function updateChannel(guild_id: string, channel: GuildChannel) {
    const ref = db.ref(`guilds/${guild_id}/channels/${channel.id}`);

    if (channel.deleted) {
        ref.remove();
        return;
    }

    ref.update({
        name: channel.name,
        position: channel.position,
        type: channel.type,
    });
}
