import { MessageEmbed } from 'discord.js';
import { client } from '../../app';
import { ICommand } from '../../types/commands';

client.commands.set('echo', {
    name: 'echo',
    arguments: [
        {
            name: 'first',
            type: 'string',
        },
        {
            name: 'output',
            type: '...string',
        },
    ],
    run: (msg, args: EchoArgs) => {
        msg.channel.send(JSON.stringify(args));
    },
});

interface EchoArgs {
    first?: string;
    output?: string;
}
