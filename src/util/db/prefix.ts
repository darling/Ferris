import { getConfig, updateProperty } from './config';

export async function changePrefix(guildId: string, prefix: string): Promise<boolean> {
    await updateProperty(guildId, { prefix: prefix });
    return true;
}

export async function getPrefix(guildId: string): Promise<string> {
    return (await getConfig(guildId))?.prefix || ';';
}
