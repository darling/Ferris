import { argumentList } from '../arguments';

argumentList.set('...string', {
    name: '...string',
    execute: async function (_argument, params) {
        if (params.length <= 0) return;

        return _argument.lowercase ? params.join(' ').toLowerCase() : params.join(' ');
    },
});
