import { Channel, Guild, GuildChannel, Role, Webhook } from 'discord.js';
import { client, db } from '../app';
import { getLoggingProps, IConfigSchema } from './db/config';
import { loggingHooks, serverConfigs } from './serverInfo';

// Each database entry needs to contain an optional config and the warnings/notes for each member.
interface IDatabaseSchema {
    config?: IConfigSchema;
    member_count: number;
    warns?: IDatabaseWarnsSchema;
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
    webhook_id: string;
}

function watchGuild(guild: Guild) {
    const ref = db.ref(`guilds/${guild.id}/config`);

    console.log('watching ' + guild.name);

    return new Promise<void>((resolve) => {
        let callback = ref.on(
            'value',
            async (snapshot) => {
                console.log('Received Database update for server ' + guild.name);
                if (snapshot.exists()) {
                    serverConfigs.set(guild.id, snapshot.exportVal());

                    const loggingInfo: ILoggingProps | undefined = getLoggingProps(guild.id);

                    if (!loggingInfo) return;

                    const webhook = await client.fetchWebhook(loggingInfo.webhook_id);
                    loggingHooks.set(guild.id, webhook);
                } else {
                    // If the parent of the guild doesn't exist, create a db entry of them.
                    if (!(await snapshot.ref.parent?.once('value'))?.exists()) {
                        newGuild(guild);
                    }
                }

                return resolve();
            },
            (err) => {
                console.error(err);
            }
        );
    });
}

function newGuild(guild: Guild) {
    // TODO: Minimize sent data
    let reference = db.ref(`guilds/${guild.id}`);

    const guildEntry: IDatabaseSchema = {
        member_count: guild.memberCount,
    };

    reference.update(guildEntry);
}

function updateUserCount(guild: Guild) {
    const reference = db.ref(`guilds/${guild.id}`);

    reference.update({
        member_count: guild.memberCount,
    });
}

async function addWarn(guild_id: string, warnedID: string, byId: string, reason?: string) {
    const timeGiven = Date.now();
    const refrence = db.ref(`guilds/${guild_id}/warns/${warnedID}/${timeGiven}`);

    refrence.update({
        reason: reason + '',
        by: byId,
    });
}

async function deleteWarn(guildId: string, warnedId: string, timestamp: string) {
    const refrence = db.ref(`guilds/${guildId}/warns/${warnedId}/${timestamp}`);

    refrence.remove();
}

export {
    updateUserCount,
    watchGuild,
    newGuild,
    IDatabaseSchema,
    ILoggingProps,
    addWarn,
    deleteWarn,
};
