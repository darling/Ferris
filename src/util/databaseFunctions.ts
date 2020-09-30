import { Guild, Webhook } from 'discord.js';
import { client, db } from '../app';
import { loggingHooks, serverConfigs } from './serverInfo';

interface IDatabaseSchema
{
    prefix: string,
    owner: string,
    name: string,
    channels: any[],
    roles: any[],
    member_count: number,
    logging?: ILoggingProps,
    webhook?: Webhook
}

interface ILoggingProps {
    channel: string,
    enabled: boolean,
    subs: number,
    webhookID: string
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

    return new Promise((resolve) => {
        let callback = ref.on('value', async (snapshot) => {
            console.log('Received Database update for server ' + guild.name);
            if(snapshot.exists()) {
                serverConfigs.set(guild.id, snapshot.val());

                const loggingInfo: ILoggingProps | undefined = snapshot.val().logging;

                if(!loggingInfo) return;

                const webhook = await client.fetchWebhook(loggingInfo.webhookID);
                loggingHooks.set(guild.id, webhook);
            } else {
                ensureGuild(guild)
            }

            return resolve();
        }, (err) => {
            console.error(err);
        })

        serverConfigs.set(guild.id, callback, 'close')
    })
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
            position: channel.position
        };
    });

    guild.roles.cache.forEach((role) => {
        roles[role.id] = {
            name: role.name,
            perms: role.permissions.bitfield,
            isManaged: role.managed,
            color: role.hexColor,
            hoisted: role.hoist,
            position: role.position
        };
    });

    reference.update({
        prefix: ';',
        owner: guild.ownerID,
        name: guild.name,
        channels: channels,
        roles: roles,
        member_count: guild.memberCount
    });
}

function updateUserCount(guild: Guild) {
    let reference = db.ref(`guilds/${guild.id}`);

    reference.update({
        member_count: guild.memberCount,
    });
}

export { ensureGuild, updateUserCount, watchGuild, newGuild, IDatabaseSchema, ILoggingProps };
