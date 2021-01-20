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
            literals: ['size', 'list'],
            defualtValue: 'size',
            required: false,
        },
    ],
    permissionLevels: [PermissionLevels.BOT_DEV],
    run: (msg, args: QueryArgs, guild) => {
        if (args.prop) {
            if (args.type === 'commands') {
                const cache = client[args.type];
                switch (args.prop) {
                    case 'size':
                        msg.channel.send(cache.size);
                    case 'list':
                        msg.channel.send(`\`\`\`${JSON.stringify(cache.keyArray())}\`\`\``);
                    default:
                        msg.channel.send('query not found');
                        break;
                }
                return;
            }
            const cache = client[args.type].cache;
            switch (args.prop) {
                case 'size':
                    msg.channel.send(cache.size);
                    break;

                default:
                    msg.channel.send('query not found');
                    break;
            }
        }
    },
});

interface QueryArgs {
    type: 'users' | 'guilds' | 'commands';
    prop?: 'size' | 'list';
}
