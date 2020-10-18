import ms from 'ms';
import { PermissionLevels } from '../../types/commands';
import { permissionLevelTests } from '../inhibitor';

permissionLevelTests.set(PermissionLevels.ADMIN, async (msg) => {
    return msg.member?.hasPermission(['ADMINISTRATOR']) || false;
});
