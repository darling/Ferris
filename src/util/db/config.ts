import {
    EmbedFieldData,
    MessageAttachment,
    FileOptions,
    MessageEmbedAuthor,
    MessageEmbedThumbnail,
    MessageEmbedImage,
    MessageEmbedVideo,
    MessageEmbedFooter,
} from 'discord.js';
import { firestore } from '../../app';
import { firestore as firestoreLib } from 'firebase-admin';
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
    custom?: ICustomCommands;
    automod?: IAutoModSettings;
    selfrole?: string[];
}

export interface IAutoModSettings extends IAutoModFilters {
    channels?: string[];
    channels_whitelist?: boolean;
    roles?: string[];
    roles_whitelist?: boolean;
    enabled?: boolean;
}

export interface IAutoModFilters {
    word_filter?: {
        tags?: IBannedWord[];
        enabled?: boolean;
    };
    link_filter?: {
        tags?: ITaggedLinks[];
        enabled?: boolean;
    };
}

export interface ITaggedLinks extends IAutomodTag {
    // This tag is just and only just the domain ie "google.com"
    slug?: string;
    domainOnly?: boolean;
}
export interface IBannedWord extends IAutomodTag {
    strict?: boolean;
    case_sensitive?: boolean;
}

export interface IAutomodTag {
    tag: string;
}

export interface ICustomCommands {
    [key: string]: {
        channel_list?: string[];
        role_list?: string[];
        whitelist?: boolean;
        embed?: {
            title?: string;
            description?: string;
            url?: string;
            timestamp?: Date | number;
            color?: string;
            fields?: EmbedFieldData[];
            author?: Partial<MessageEmbedAuthor> & { icon_url?: string; proxy_icon_url?: string };
            thumbnail?: Partial<MessageEmbedThumbnail> & { proxy_url?: string };
            image?: Partial<MessageEmbedImage> & { proxy_url?: string };
            footer?: Partial<MessageEmbedFooter> & { icon_url?: string; proxy_icon_url?: string };
        };
    };
}

export async function getConfig(guildId: string): Promise<IConfigSchema | undefined> {
    return serverConfigs.get(guildId);
}

// export async function subscribeConfig(guildId: string) {
//     const doc = firestore.collection('configs').doc(guildId);

//     doc.onSnapshot((snapshot) => {
//         serverConfigs.set(guildId, (snapshot.data() || {}) as IConfigSchema);
//     });
// }

export function getLoggingProps(guild_id: string): ILoggingProps | undefined {
    return serverConfigs.get(guild_id)?.logging;
}

export async function updateProperty(guild_id: string, data: IConfigSchema) {
    const doc = firestore.collection('configs').doc(guild_id);

    console.log('WRITING TO DB', data);

    await doc.set(data, { merge: true });
}

export async function appendProperty(
    guild_id: string,
    property: keyof IConfigSchema,
    data: unknown[]
) {
    const doc = firestore.collection('configs').doc(guild_id);

    console.log('APPENDING TO DB', property, data);

    await doc.set({ [property]: firestoreLib.FieldValue.arrayUnion(...data) }, { merge: true });
}

export async function removeProperty(
    guild_id: string,
    property: keyof IConfigSchema,
    data: unknown[]
) {
    const doc = firestore.collection('configs').doc(guild_id);

    console.log('REMOVING FROM ARRAY IN DB', property, data);

    await doc.set({ [property]: firestoreLib.FieldValue.arrayRemove(...data) }, { merge: true });
}

export async function deleteProperty(guild_id: string, property: keyof IConfigSchema) {
    const doc = firestore.collection('configs').doc(guild_id);

    console.log('DELETING ON DB');

    await doc.set({ [property]: firestoreLib.FieldValue.delete() }, { merge: true });
}

export async function updateLogChannelProperty(guildId: string, data: Partial<ILoggingProps>) {
    const doc = firestore.collection('configs').doc(guildId);

    console.log('WRITING TO DB');

    await doc.set({ logging: data }, { merge: true });
}
