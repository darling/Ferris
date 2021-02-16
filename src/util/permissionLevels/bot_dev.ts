import { PermissionLevels } from '../../types/commands';
import { permissionLevelTests } from '../inhibitor';

permissionLevelTests.set(PermissionLevels.BOT_DEV, async (msg) => {
    // TODO: Make it so bot devs are able to be added and delted from Carter
    return ['141075183271280641', '556577211784757253', '454947744625459200'].includes(
        msg.author.id
    );
});
