import { client } from '../../app';
import { pendingUnpunishments } from '../../util/serverInfo';

client.commands.set('cpunishments', {
    name: 'cpunishments',
    arguments: [
        {
            name: 'user',
            type: 'member',
        },
    ],
    run: (msg, args, guild) => {
        msg.channel.send(JSON.stringify(pendingUnpunishments.get(args.user.id).data, null, 2));
    },
});
