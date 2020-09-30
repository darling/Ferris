import { APIMessage, StringResolvable, Webhook } from 'discord.js';
import { loggingHooks } from './serverInfo';

// type LoggingTypes = "MESSAGE_DELETED" | "MESSAGE_UPDATED"

export async function newLog(guildID: string, content: StringResolvable | APIMessage) {
    const webhook: Webhook | undefined = loggingHooks.get(guildID);

    if(webhook === undefined) {
        return;
    }

    await webhook.send(content);
}