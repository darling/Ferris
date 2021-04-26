import { client } from '../../app';
import { messageReply } from '../../util/interactions/message';

client.commands.set('ping', {
    name: 'ping',
    arguments: [],
    run: (msg) => {
        messageReply(msg.channel, '🏓 Pong!');
    },
});
