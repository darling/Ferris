import { User } from 'discord.js';
import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { messageReply } from '../../util/interactions/message';

client.commands.set('has-premium', {
    name: 'has-premium',
    arguments: [
        {
            name: 'member',
            type: 'member',
        },
    ],
    permissionLevels: [PermissionLevels.FERRIS_STAFF],
    run: (msg, args: StaffArgs) => {
        messageReply(msg.channel, JSON.stringify({ message: 'This is under construction' }));
    },
});

interface StaffArgs {
    member: User;
}
