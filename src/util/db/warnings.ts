import { admin, client, firestore } from '../../app';

export interface IWarnings {
    [timeStamp: string]: {
        by: {
            name: string;
            id: string;
        };
        reason?: string;
    };
}

export async function getWarningsForUser(
    guildId: string,
    userId: string
): Promise<IWarnings | undefined> {
    const doc = firestore.collection('guilds').doc(guildId).collection('warnings').doc(userId);
    const warnings = await doc.get();
    return warnings.data();
}

export async function addWarn(guildId: string, warnedID: string, byId: string, reason?: string) {
    const timeGiven = Date.now();
    const doc = firestore.collection('guilds').doc(guildId).collection('warnings').doc(warnedID);

    const byUser = await client.users.fetch(byId);

    let warning: any = {};

    warning[timeGiven] = {
        by: {
            name: byUser.username,
            id: byUser.id,
        },
        reason: reason,
    };

    await doc.set(warning, { merge: true });
}

export async function deleteWarn(guildId: string, warnedId: string, timestamp: string) {
    const doc = firestore.collection('guilds').doc(guildId).collection('warnings').doc(warnedId);

    doc.update({
        [timestamp]: admin.firestore.FieldValue.delete(),
    });
}
