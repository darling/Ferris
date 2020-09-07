import { Guild } from 'discord.js';
import { db } from '../app';

function ensureGuild(guild: Guild) {
    let reference = db.ref(`guilds/${guild.id}`);

    reference.once('value', (snapshot) => {
        if (!snapshot.exists()) {
            let channels: any = {};

            guild.channels.cache.forEach((channel) => {
                channels[channel.id] = {
                    type: channel.type,
                    name: channel.name,
                    manageable: channel.manageable,
                    position: channel.position,
                };
            });

            reference.set({
                prefix: ';',
                owner: guild.ownerID,
                name: guild.name,
                channels: channels,
                member_count: guild.memberCount,
            });
        }
    });
}

function updateUserCount(guild: Guild) {
    let reference = db.ref(`guilds/${guild.id}`);

    reference.update({
        member_count: guild.memberCount,
    });
}

export { ensureGuild, updateUserCount };
