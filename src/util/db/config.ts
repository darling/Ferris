import { db } from '../../app';
import { ILoggingProps } from '../databaseFunctions';

export interface IConfigSchema {
    prefix?: string;
    // Admins need to be a list of ids
    admins?: string[];
    // Same with mods
    mods?: string[];
    members_can_use_bot?: boolean;
    log_channel?: ILoggingProps;
}

export function updateProperty(guildId: string, data: IConfigSchema) {
    const ref = db.ref(`guilds/${guildId}/config`);

    ref.update(data);
}

export function updateLogChannel(guildId: string, data: ILoggingProps) {
    updateProperty(guildId, {
        log_channel: data,
    });
}
