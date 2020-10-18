import { PermissionLevels } from '../../types/commands';
import { permissionLevelTests } from '../inhibitor';

permissionLevelTests.set(PermissionLevels.MEMBER, async () => true);
