import { APIMessage, StringResolvable, Webhook } from 'discord.js';
import { loggingHooks, serverConfigs } from './serverInfo';
import { LoggingTypes } from '../types/log';

export function isLoggable(type: LoggingTypes, guildID: string): boolean {
    const logConfig = getLogConfig(guildID);
    return 0 === (logConfig & logTypeToBit(type));
}

function getLogConfig(guildID: string) {
    return +serverConfigs.get(guildID, 'logging.subs')!;
}

function logTypeToBit(type: LoggingTypes): number {
    // HOW CAN I MAKE THIS BETTER ASDLJFKLDFS

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
