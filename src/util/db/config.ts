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
}

export interface IAutoModSettings {
    channels?: string[];
    roles?: string[];
    enabled?: boolean;
    word_filter?: {
        banned_words?: IBannedWord[];
        enabled?: boolean;
    };
}

export interface IBannedWord {
    tag: string;
    strict: boolean;
    case_sensitive: boolean;
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

export function getLoggingProps(guildId: string): ILoggingProps | undefined {
    return serverConfigs.get(guildId)?.logging;
}

export async function updateProperty(guildId: string, data: IConfigSchema) {
    const doc = firestore.collection('configs').doc(guildId);

    await doc.set(data, { merge: true });
}

export async function updateLogChannelProperty(guildId: string, data: Partial<ILoggingProps>) {
    const doc = firestore.collection('configs').doc(guildId);

    await doc.set({ logging: data }, { merge: true });
}
