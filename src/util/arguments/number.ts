import { random } from 'lodash';
import { argumentList } from '../arguments';

argumentList.set('number', {
    name: 'number',
    execute: async function (_argument, params) {
        const [number] = params;

        const valid = Number(number);
        if (valid) return valid;
    },
    example: () => {
        const input = random(100, false);
        return `${input}`;
    },
    description: 'A number is a mathematical object used to measure and count.',
});
