import { PermissionLevels } from '../../types/commands';
import { permissionLevelTests } from '../inhibitor';

permissionLevelTests.set(PermissionLevels.MODERATOR, async (msg) => {
    return msg.member?.permissions.has('KICK_MEMBERS') || false;
});
