import { client } from '../../app';
import { messageReply } from '../../util/interactions/message';

client.commands.set('ping', {
    name: 'ping',
    arguments: [],
    run: (msg) => {
        messageReply(msg.channel, '🏓 Pong!');
    },
    description: '**PONG!** This can also be used to see if Ferris died. ',
});
