import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';

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
    permissionLevels: [PermissionLevels.BOT_DEV],
    run: (msg, args: EchoArgs) => {
        msg.channel.send(JSON.stringify(args));
    },
});

interface EchoArgs {
    first?: string;
    output?: string;
}
