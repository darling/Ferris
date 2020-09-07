import { client } from '../app';

const isDebug = false;

if (isDebug) {
    client.on('debug', (info) => {
        console.debug(info);
    });
}
