import { APIMessage, StringResolvable, Webhook } from 'discord.js';
import { loggingHooks, serverConfigs } from './serverInfo';
import { LoggingTypes } from '../types/log';
import { getLoggingProps } from './db/config';

export interface ILoggingProps {
    channel: string;
    enabled: boolean;
    subs: number;
    webhook_id: string;
}

// Will return if a certian part of LoggingTypes is not listed in the config, Will also return false if there's no config at all.
export function isLoggable(type: LoggingTypes, guildID: string): boolean {
    const logConfig = getLogSubs(guildID);
    if (!logConfig) return true;

    const { enabled } = getLoggingProps(guildID)!;
    if (!enabled) return true;

    return 0 === (logConfig & logTypeToBit(type));
}

export function getLogSubs(guildID: string): number | undefined {
    return serverConfigs.get(guildID)?.logging?.subs;
}

export const typesAsArray: LoggingTypes[] = [
    'MESSAGE_DELETED',
    'MESSAGE_UPDATED',
    'BAN_ADDED',
    'BAN_REMOVED',
    'MEMBER_JOINED',
    'MEMBER_LEFT',
    'MEMBER_KICKED',
    'INTEGRATIONS_UPDATE',
    'GUILD_UPDATE',
    'INVITE_CREATE',
    'INVITE_DELETE',
    'MESSAGE_DELETED_BULK',
    'ROLE_CREATED',
    'ROLE_UPDATED',
    'ROLE_DELETED',
    'WEBHOOK_UPDATE',
    'MUTE_ADDED',
    'MUTE_UPDATED',
    'MUTE_DELETED',
    'CHANNEL_CREATED',
    'CHANNEL_DELETED',
];

function logTypeToBit(type: LoggingTypes): number {
    const bit = 1 << typesAsArray.indexOf(type);
    return bit;
}

function bitToLogType(bit: number): LoggingTypes | undefined {
    return typesAsArray[Math.sqrt(bit)] || undefined;
}

export function logSubsToLogTypes(subs: number): LoggingTypes[] | undefined {
    const subArray = subs
        .toString(2)
        .split('')
        .map((x) => x === '1');
    const logTypesArray = typesAsArray.filter((t, i) => {
        return subArray[i];
    });
    return logTypesArray || undefined;
}

export async function newLog(guildID: string, content: StringResolvable | APIMessage) {
    const webhook: Webhook | undefined = loggingHooks.get(guildID);

    if (webhook === undefined) {
        return;
    }

    await webhook.send(content);
}
