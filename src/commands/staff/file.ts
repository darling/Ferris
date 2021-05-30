import { User } from 'discord.js';
import { admin, client } from '../../app';
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
    run: async (msg, args: StaffArgs) => {
        const user = await admin.auth().getUser(args.member.id);

        messageReply(msg.channel, JSON.stringify(user.metadata));
    },
    display: false,
    description: 'List members data as admin',
});

interface StaffArgs {
    member: User;
}
