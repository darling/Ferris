import { db } from '../../app';

export interface IWarnings {
    [timeStamp: string]: {
        by: string;
        reason: string | undefined;
    };
}

export async function getWarningsForUser(
    guildId: string,
    userId: string
): Promise<IWarnings | undefined> {
    const ref = db.ref(`guilds/${guildId}/warns/${userId}`);
    const warnings = await ref.once('value');
    return warnings.exportVal() || undefined;
}

export async function addWarn(guild_id: string, warnedID: string, byId: string, reason?: string) {
    const timeGiven = Date.now();
    const refrence = db.ref(`guilds/${guild_id}/warns/${warnedID}/${timeGiven}`);

    refrence.update({
        reason: reason + '',
        by: byId,
    });
}

export async function deleteWarn(guildId: string, warnedId: string, timestamp: string) {
    const refrence = db.ref(`guilds/${guildId}/warns/${warnedId}/${timestamp}`);

    refrence.remove();
}
