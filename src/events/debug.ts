import { client } from '../app';

client.on('debug', (info) => {
    console.debug(info);
});
