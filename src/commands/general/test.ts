import { Message, MessageEmbed } from 'discord.js';
import { client, FerrisClient } from '../../app';

client.commands.set('test', {
    name: 'test',
    arguments: [
        {
            name: 'firstStringLower',
            type: 'string',
            required: true,
        },
        {
            name: 'secondMember',
            type: 'member',
            required: true,
            missing: (msg) => {
                msg.reply('Please insert a mention for the second value');
            },
        },
        {
            name: 'thirdBool',
            type: 'boolean',
        },
    ],
    run: (msg, args: TestArgs) => {
        msg.channel.send(JSON.stringify(args));
    },
});

interface TestArgs {
    first?: string;
    second?: string;
    third?: string;
}
