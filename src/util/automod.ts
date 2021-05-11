import { firestore } from 'firebase-admin';

import { getConfig, IAutoModFilters, IAutomodTag, updateProperty } from './db/config';

export async function automodEnabled(guild_id: string) {
    const config = await getConfig(guild_id);

    return !!config?.automod?.enabled;
}

export async function automodToggle(guild_id: string, enabled: boolean) {
    await updateProperty(guild_id, { automod: { enabled } });
}

export async function automodToggleBranch(
    guild_id: string,
    branch: keyof IAutoModFilters,
    enabled: boolean
) {
    await updateProperty(guild_id, { automod: { [branch]: { enabled } } });
}

export async function automodAddTag(guild_id: string, branch: keyof IAutoModFilters, tag: string) {
    await updateProperty(guild_id, {
        automod: { [branch]: { tags: firestore.FieldValue.arrayUnion({ tag }) } },
    });
}

export async function automodDeleteTag(
    guild_id: string,
    branch: keyof IAutoModFilters,
    tag: IAutomodTag
) {
    await updateProperty(guild_id, {
        automod: { [branch]: { tags: firestore.FieldValue.arrayRemove(tag) } },
    });
}

export async function automodGetTags(guild_id: string, branch: keyof IAutoModFilters) {
    const config = await getConfig(guild_id);

    return config?.automod?.[branch]?.tags;
}
