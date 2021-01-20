import ms from 'ms';
import { PermissionLevels } from '../../types/commands';
import { permissionLevelTests } from '../inhibitor';

permissionLevelTests.set(PermissionLevels.FERRIS_STAFF, async (msg) => {
    // me, matt, cot
    return ['141075183271280641', '556577211784757253', '743477369888833599'].includes(
        msg.author.id
    );
});
