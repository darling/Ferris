import { Guild } from 'discord.js';
import { firestore } from '../../app';

export interface IDatabaseGuild {
    roles: {
        [id: string]: {
            name: string;
            permissions: number;
        };
    };
    channels: {
        [id: string]: {
            name: string;
            type: string;
        };
    };
    member_count: number;
    name: string;
    icon: string;
}

export async function newGuild(guild: Guild) {
    const doc = firestore.collection('guilds').doc(guild.id);

    let newGuildData: IDatabaseGuild = {
        name: guild.name,
        icon: guild.icon || 'none',
        member_count: guild.memberCount,
        channels: {},
        roles: {},
    };

    guild.channels.cache.forEach((channel) => {
        newGuildData.channels[channel.id] = {
            name: channel.name,
            type: channel.type,
        };
    });

    guild.roles.cache.forEach((role) => {
        newGuildData.roles[role.id] = {
            name: role.name,
            permissions: role.permissions.bitfield,
        };
    });

    doc.set(newGuildData);
}

export async function updateGuildProperty(guildId: string, data: Partial<IDatabaseGuild>) {
    const doc = firestore.collection('guilds').doc(guildId);

    doc.set(data, { merge: true });
}

export async function updateGuildMemberCount(guild: Guild) {
    await updateGuildProperty(guild.id, { member_count: guild.memberCount });
}
