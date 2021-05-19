import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { messageReply } from '../../util/interactions/message';

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
                        messageReply(msg.channel, cache.size);
                    case 'list':
                        messageReply(
                            msg.channel,
                            `\`\`\`${JSON.stringify(cache.keyArray())}\`\`\``
                        );
                    default:
                        messageReply(msg.channel, 'query not found');
                        break;
                }
                return;
            }
            const cache = client[args.type].cache;
            switch (args.prop) {
                case 'size':
                    messageReply(msg.channel, cache.size);
                    break;

                default:
                    messageReply(msg.channel, 'query not found');
                    break;
            }
        }
    },
    display: false,
});

interface QueryArgs {
    type: 'users' | 'guilds' | 'commands';
    prop?: 'size' | 'list';
}
