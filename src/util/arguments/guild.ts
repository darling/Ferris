import ms from 'ms';
import { client } from '../../app';
import { argumentList } from '../arguments';

argumentList.set('guild', {
    name: 'guild',
    execute: async function (_argument, params) {
        const [id] = params;
        if (!id) return;

        return client.guilds.cache.get(id);
    },
});
