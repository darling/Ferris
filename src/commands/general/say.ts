import { client } from '../../app';
import { messageReply } from '../../util/interactions/message';
import { missingParamEmbed } from '../../util/embedTemplates';

client.commands.set('say', {
    name: 'say',
    arguments: [
        {
            name: 'message',
            type: 'string',
            missing: (msg) => {
                missingParamEmbed(msg.channel, 'Make me say something');
            },
        },
    ],
    run: (msg, args) => {
        messageReply(msg.channel, 'I said something! : ' + args.message);
    },
    description: 'Say',
});
