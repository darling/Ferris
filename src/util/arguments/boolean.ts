import { sample } from 'lodash';
import { argumentList } from '../arguments';

argumentList.set('boolean', {
    name: 'boolean',
    execute: async function (_argument, params) {
        const [boolean] = params;

        const valid = ['true', 'false', 'on', 'off'].includes(boolean);
        if (valid) return ['true', 'on'].includes(boolean);
    },
    example: () => {
        return sample(['true', 'false', 'on', 'off']) || 'true';
    },
});
