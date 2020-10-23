import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';

client.commands.set('query', {
    name: 'query',
    arguments: [
        {
            name: 'type',
            type: 'string',
            literals: ['users', 'guilds', 'commands'],
            required: true,
        },
        {
            name: 'prop',
            type: 'string',
            required: false,
        },
    ],
    permissionLevels: [PermissionLevels.BOT_DEV],
    run: (msg, args: QueryArgs) => {
        if (args.prop) {
            if (args.type === 'commands') {
                const cache = client[args.type];
                return;
            }
            const cache = client[args.type].cache;
            switch (args.prop) {
                case 'size':
                    msg.channel.send(cache.size);
                    break;

                default:
                    break;
            }
        }
    },
});

interface QueryArgs {
    type: 'users' | 'guilds' | 'commands';
    prop?: 'size';
}
