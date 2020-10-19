import { inhibitors, permissionLevelTests } from '../inhibitor';

inhibitors.set('permLevel', async (msg, command, guild) => {
    if (!command.permissionLevels?.length) return false;

    if (typeof command.permissionLevels === 'function') {
        const allowed = await command.permissionLevels(msg, command, guild);
        return !allowed;
    }

    for (const permLevel of command.permissionLevels) {
        const hasPerm = permissionLevelTests.get(permLevel); // get permission level checks for any of the listed perm level
        if (!hasPerm) continue;

        const allowed = await hasPerm(msg, command, guild);
        if (allowed) return false;
    }

    return true;
});
