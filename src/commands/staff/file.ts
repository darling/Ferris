import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';

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
        msg.channel.send(JSON.stringify({ message: 'This is under construction' }));
    },
});

interface StaffArgs {
    member: string;
}
