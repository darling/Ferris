import { client } from '../../app';

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
            defualtValue: 'This is stupid',
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
