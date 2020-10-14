import ms from 'ms';
import { argumentList } from '../arguments';

argumentList.set('duration', {
    name: 'duration',
    execute: async function (_argument, params) {
        const [time] = params;
        if (!time) return;

        return ms(time);
    },
});
