import { APIMessage, StringResolvable, Webhook } from 'discord.js';
import { loggingHooks, serverConfigs } from './serverInfo';
import { LoggingTypes } from '../types/log';

// Will return if a certian part of LoggingTypes is not listed in the config, Will also return false if there's no config at all.
export function isLoggable(type: LoggingTypes, guildID: string): boolean {
    const logConfig = getLogConfig(guildID);

    if (!logConfig) return false;
    console.log('is it making it');
    return 0 === (logConfig & logTypeToBit(type));
}

function getLogConfig(guildID: string): number | undefined {
    return serverConfigs.get(guildID)?.config?.log_channel?.subs;
}

function logTypeToBit(type: LoggingTypes): number {
    // Found the answer, it's an enum

    const typesAsArray: LoggingTypes[] = [
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

    const bit = 1 << typesAsArray.indexOf(type);
    return bit;
}

export async function newLog(guildID: string, content: StringResolvable | APIMessage) {
    const webhook: Webhook | undefined = loggingHooks.get(guildID);

    if (webhook === undefined) {
        return;
    }

    await webhook.send(content);
}
