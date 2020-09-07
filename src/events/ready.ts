import { client } from '../app';

client.on('ready', () => {
    if (client.user)
        console.log(`Logged in as ${client.user.tag}`);
})