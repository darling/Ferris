import { client } from '../app';

const isDebug = true;

if (isDebug) {
    client.on('debug', (info) => {
        console.debug(info);
    });
}
