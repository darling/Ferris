import { firestore as adminfirestore } from 'firebase-admin';
import { admin, client, firestore } from '../../app';

export interface IWarnings {
    [timeStamp: string]: IWarning;
}

export interface IWarning {
    by: string;
    reason?: string;
    automated: boolean;
}

export async function getWarningsForUser(
    guildId: string,
    userId: string
): Promise<IWarnings | undefined> {
    const doc = firestore.collection('guilds').doc(guildId).collection('warnings').doc(userId);
    const warnings = await doc.get();
    return warnings.data();
}

export async function addWarn(guildId: string, warnedID: string, warnings: IWarning[]) {
    const timeGiven = Date.now();
    const doc = firestore.collection('guilds').doc(guildId).collection('warnings').doc(warnedID);

    let newWarning: any = {};

    warnings.forEach(async (warning) => {
        newWarning[timeGiven] = warning;
    });

    await doc.set(newWarning, { merge: true });
}

export async function deleteWarn(guildId: string, warnedId: string, timestamp: string) {
    const doc = firestore.collection('guilds').doc(guildId).collection('warnings').doc(warnedId);

    doc.update({
        [timestamp]: admin.firestore.FieldValue.delete(),
    });
}
