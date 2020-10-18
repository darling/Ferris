import { PermissionLevels } from '../../types/commands';
import { permissionLevelTests } from '../inhibitor';

permissionLevelTests.set(PermissionLevels.SERVER_OWNER, async (msg) => {
    return msg.guild?.ownerID === msg.author.id || false;
});
