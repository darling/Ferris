import { getConfig, updateProperty } from './config';

export function changePrefix(guildId: string, prefix: string): boolean {
    updateProperty(guildId, { prefix: prefix });
    return true;
}

export function getPrefix(guildId: string): string {
    return getConfig(guildId)?.prefix || ';';
}
