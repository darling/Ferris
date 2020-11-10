import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';

client.commands.set('basic', {
    name: 'basic',
    arguments: [],
    permissionLevels: [PermissionLevels.BOT_DEV],
    run: (msg, args: Args) => {
        msg.channel.send(JSON.stringify(args));
    },
});

interface Args {}
