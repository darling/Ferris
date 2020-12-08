import { APIMessage, StringResolvable, Webhook } from 'discord.js';
import { serverConfigs } from './serverInfo';
import { LoggingTypes } from '../types/log';
import { getLoggingProps, updateLogChannelProperty } from './db/config';
import { client } from '../app';

export interface ILoggingProps {
    channel: string;
    enabled: boolean;
    subs: LoggingTypes[];
    webhook_id: string;
}

// Will return if a certian part of LoggingTypes is not listed in the config, Will also return false if there's no config at all.
export function isLoggable(type: LoggingTypes, guildID: string): boolean {
    const logConfig = getLogSubs(guildID);
    if (!logConfig) return false;

    const { enabled } = getLoggingProps(guildID) || { enabled: false };

    return enabled ? (logConfig.includes(type)) : false;
}

// This will return empty for no subscription at all
export function getLogSubs(guildID: string): LoggingTypes[] {
    if(typeof serverConfigs.get(guildID)?.logging?.subs !== typeof []) {
        updateLogChannelProperty(guildID, { subs: typesAsArray })
        return typesAsArray;
    }
    return serverConfigs.get(guildID)?.logging?.subs || [];
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
    'ROLE_GIVEN',
    'ROLE_REMOVED',
];

export async function getWebhook(guildId: string) {
    let loggingProps: ILoggingProps | undefined = getLoggingProps(guildId);
    if (!loggingProps) {
        return;
    };

    try {
        const webhook = await client.fetchWebhook(loggingProps.webhook_id)
        return webhook;
    } catch {
        return;
    }
}

export async function newLog(type: LoggingTypes, guildId: string, content: StringResolvable | APIMessage) {

    if (!getLogSubs(guildId).includes(type)) {
        return;
    }

    const webhook = await getWebhook(guildId);

    if (webhook === undefined) {
        return;
    }

    await webhook.send(content);
}
