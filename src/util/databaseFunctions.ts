import { Channel, Guild, GuildChannel, Role, Webhook } from 'discord.js';
import { client, db } from '../app';
import { loggingHooks, serverConfigs } from './serverInfo';

interface IDatabaseSchema {
    prefix: string;
    owner: string;
    name: string;
    warns: IDatabaseWarnsSchema;
    channels: any[];
    roles: any[];
    member_count: number;
    logging?: ILoggingProps;
    webhook?: Webhook;
}

interface IDatabaseWarnsSchema {
    [user: string]: {
        [warn: number]: { by: string; reason: string };
    };
}

interface ILoggingProps {
    channel: string;
    enabled: boolean;
    subs: number;
    webhookID: string;
}

function ensureGuild(guild: Guild) {
    let reference = db.ref(`guilds/${guild.id}`);
    console.log('Ensuring ' + guild.name);

    reference.once('value', (snapshot) => {
        if (!snapshot.exists()) {
            newGuild(guild);
        }
    });
}

function watchGuild(guild: Guild) {
    const ref = db.ref(`guilds/${guild.id}`);

    return new Promise<void>((resolve) => {
        let callback = ref.on(
            'value',
            async (snapshot) => {
                console.log('Received Database update for server ' + guild.name);
                if (snapshot.exists()) {
                    serverConfigs.set(guild.id, snapshot.val());

                    const loggingInfo: ILoggingProps | undefined = snapshot.val().logging;

                    if (!loggingInfo) return;

                    const webhook = await client.fetchWebhook(loggingInfo.webhookID);
                    loggingHooks.set(guild.id, webhook);
                } else {
                    ensureGuild(guild);
                }

                return resolve();
            },
            (err) => {
                console.error(err);
            }
        );

        serverConfigs.set(guild.id, callback, 'close');
    });
}

function newGuild(guild: Guild) {
    // TODO: Minimize sent data
    let reference = db.ref(`guilds/${guild.id}`);
    console.log('Ensuring ' + guild.name);

    let channels: any = {};
    let roles: any = {};

    guild.channels.cache.forEach((channel) => {
        channels[channel.id] = {
            type: channel.type,
            name: channel.name,
            manageable: channel.manageable,
            position: channel.position,
        };
    });

    guild.roles.cache.forEach((role) => {
        roles[role.id] = {
            name: role.name,
            perms: role.permissions.bitfield,
            isManaged: role.managed,
            color: role.hexColor,
            hoisted: role.hoist,
            position: role.position,
        };
    });

    reference.update({
        prefix: ';',
        owner: guild.ownerID,
        name: guild.name,
        channels: channels,
        roles: roles,
        member_count: guild.memberCount,
    });
}

function updateUserCount(guild: Guild) {
    const reference = db.ref(`guilds/${guild.id}`);

    reference.update({
        member_count: guild.memberCount,
    });
}

async function updateChannel(guild_id: string, channel: Channel) {
    if (channel.type === 'dm' || channel.type === 'unknown') return;
    const reference = db.ref(`guilds/${guild_id}/channels/${channel.id}`);
    const guildChannel = channel as GuildChannel;

    await reference.update({
        type: channel.type,
        name: guildChannel.name,
        manageable: guildChannel.manageable,
        position: guildChannel.position,
    });
}

async function deleteChannel(guild_id: string, channel: Channel) {
    const reference = db.ref(`guilds/${guild_id}/channels/${channel.id}`);
    await reference.remove();
}

async function udpateRole(guild_id: string, role: Role) {
    const reference = db.ref(`guilds/${guild_id}/roles/${role.id}`);

    await reference.update({
        name: role.name,
        perms: role.permissions.bitfield,
        isManaged: role.managed,
        color: role.hexColor,
        hoisted: role.hoist,
        position: role.position,
    });
}

async function deleteRole(guild_id: string, role: Role) {
    const reference = db.ref(`guilds/${guild_id}/roles/${role.id}`);
    await reference.remove();
}

async function addWarn(guild_id: string, warnedID: string, reason: string, byId: string) {
    const timeGiven = Date.now();
    const refrence = db.ref(`guilds/${guild_id}/warns/${warnedID}/${timeGiven}`);

    refrence.update({
        reason: reason,
        by: byId,
    });
}

async function deleteWarn(guildId: string, warnedId: string, timestamp: string) {
    const refrence = db.ref(`guilds/${guildId}/warns/${warnedId}/${timestamp}`);

    refrence.remove();
}

export {
    ensureGuild,
    updateUserCount,
    watchGuild,
    newGuild,
    IDatabaseSchema,
    ILoggingProps,
    updateChannel,
    deleteChannel,
    udpateRole,
    deleteRole,
    addWarn,
    deleteWarn,
};
