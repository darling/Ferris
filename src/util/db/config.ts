import { db } from '../../app';
import { ILoggingProps } from '../databaseFunctions';
import { serverConfigs } from '../serverInfo';

export interface IConfigSchema {
    prefix?: string;
    // Admins need to be a list of ids
    admins?: string[];
    auto_role?: string;
    // Same with mods
    mods?: string[];
    members_can_use_bot?: boolean;
    log_channel?: ILoggingProps;
}

export function getConfig(guildId: string): IConfigSchema | undefined {
    return serverConfigs.get(guildId);
}

export function getLoggingProps(guildId: string): ILoggingProps | undefined {
    return serverConfigs.get(guildId)?.log_channel;
}

export function updateProperty(guildId: string, data: IConfigSchema) {
    const ref = db.ref(`guilds/${guildId}/config`);

    ref.update(data);
}

export function updateLogChannelProperty(guildId: string, data: Partial<ILoggingProps>) {
    const ref = db.ref(`guilds/${guildId}/config/log_channel`);

    ref.update(data);
}

export function updateLogChannel(guildId: string, data: ILoggingProps) {
    updateProperty(guildId, {
        log_channel: data,
    });
}
