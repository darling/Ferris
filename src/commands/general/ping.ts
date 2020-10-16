import { client } from '../../app';

client.commands.set('ping', {
    name: 'ping',
    arguments: [],
    run: (msg) => {
        msg.channel.send('Pong!');
    },
});
