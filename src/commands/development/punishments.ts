import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { pendingUnpunishments } from '../../util/serverInfo';

client.commands.set('cpunishments', {
    name: 'cpunishments',
    arguments: [
        {
            name: 'user',
            type: 'member',
        },
    ],
    permissionLevels: [PermissionLevels.BOT_DEV],
    run: (msg, args, guild) => {
        msg.channel.send(JSON.stringify(pendingUnpunishments.get(args.user.id).data, null, 2));
    },
    display: false,
});
