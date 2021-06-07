import { admin, client, firestore } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { messageReply } from '../../util/interactions/message';

client.commands.set('size', {
    name: 'size',
    arguments: [],
    permissionLevels: [PermissionLevels.FERRIS_STAFF],
    run: async (msg) => {
        messageReply(
            msg.channel,
            `\`\`\`${JSON.stringify({
                guilds: client.guilds.cache.size,
                users: client.users.cache.size,
                shards: client.shard?.count || 'None',
            })}\`\`\``
        );
    },
    display: false,
    description: 'Server data',
});
