import { firestore } from '../../app';
import { serverConfigs } from '../serverInfo';
import { ILoggingProps } from '../webhookLogging';

export interface IConfigSchema {
    prefix?: string;
    // Admins need to be a list of ids
    admins?: string[];
    auto_role?: string;
    muted_role?: string;
    // Same with mods
    mods?: string[];
    members_can_use_bot?: boolean;
    logging?: ILoggingProps;
}

export function getConfig(guildId: string): IConfigSchema | undefined {
    return serverConfigs.get(guildId);
}

export async function subscribeConfig(guildId: string) {
    const doc = firestore.collection('configs').doc(guildId)

    doc.onSnapshot(snapshot => {
        serverConfigs.set(guildId, (snapshot.data() || {}) as IConfigSchema)
    })
}

export function getLoggingProps(guildId: string): ILoggingProps | undefined {
    return serverConfigs.get(guildId)?.logging;
}

export async function updateProperty(guildId: string, data: IConfigSchema) {
    const doc = firestore.collection('configs').doc(guildId)

    await doc.set(data, { merge: true });
}

export async function updateLogChannelProperty(guildId: string, data: Partial<ILoggingProps>) {
    const doc = firestore.collection('configs').doc(guildId)

    await doc.set({ logging: data }, { merge: true });
}