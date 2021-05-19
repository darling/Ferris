import { sample } from 'lodash';
import { argumentList } from '../arguments';

argumentList.set('string', {
    name: 'string',
    execute: async function (_argument, params) {
        const [text] = params;

        const valid =
            _argument.literals?.length && text
                ? _argument.literals.includes(text.toLowerCase())
                    ? text
                    : undefined
                : text;

        if (valid) return _argument.lowercase ? valid.toLowerCase() : valid;
    },
    example: () => {
        return sample(['word', 'example', 'string', 'hello']) || 'word';
    },
    description:
        'The string type is a single word separated by spaces. You can put anything in the string input but if you put another space, it will end. You can not ping or mention items in the string input.',
});
