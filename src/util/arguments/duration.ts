import { randomInt } from 'crypto';
import { sample, random } from 'lodash';
import ms from 'ms';
import { argumentList } from '../arguments';

argumentList.set('duration', {
    name: 'duration',
    execute: async function (_argument, params) {
        const [time] = params;
        if (!time) return;

        return ms(time);
    },
    example: () => {
        const type = sample(['y', 'h', 'd', 's']) || 'd';
        const value = random(15, false);
        return `${value}${type}`;
    },
});
