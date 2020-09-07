import { Guild } from 'discord.js';
import { db } from '../app';
import { serverConfigs } from './serverinfo';

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

function watchGuild(guild: Guild) {
    const ref = db.ref(`guilds/${guild.id}`);

    return new Promise((resolve) => {
        let callback = ref.on('value', (snapshot) => {
            if(snapshot.exists()) {
                serverConfigs.set(guild.id, snapshot.val());
                return resolve();
            }

            ensureGuild(guild)
            return resolve();
        }, (err) => {
            console.error(err);
        })

        serverConfigs.set(guild.id, callback, 'close')
    })
}

function updateUserCount(guild: Guild) {
    let reference = db.ref(`guilds/${guild.id}`);

    reference.update({
        member_count: guild.memberCount,
    });
}

export { ensureGuild, updateUserCount, watchGuild };
