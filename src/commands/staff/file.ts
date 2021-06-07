import { User } from 'discord.js';
import { admin, client, firestore } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { messageReply } from '../../util/interactions/message';

client.commands.set('file', {
    name: 'file',
    arguments: [
        {
            name: 'member',
            type: 'member',
            required: true,
        },
    ],
    permissionLevels: [PermissionLevels.FERRIS_STAFF],
    run: async (msg, args: StaffArgs) => {
        const user = await admin.auth().getUser(args.member.id);
        const userData = await firestore.collection('users').doc(args.member.id).get();

        console.log(user);

        messageReply(
            msg.channel,
            `\`\`\`${JSON.stringify({
                premium: userData.data()?.premium || false,
            })}\`\`\``
        );
    },
    display: false,
    description: 'List members premium as admin',
});

client.commands.set('has-premium', {
    name: 'has-premium',
    arguments: [
        {
            name: 'member',
            type: 'member',
            required: true,
        },
    ],
    permissionLevels: [PermissionLevels.FERRIS_STAFF],
    run: async (msg, args: StaffArgs) => {
        const user = await admin.auth().getUser(args.member.id);
        const userData = await firestore.collection('users').doc(args.member.id).get();

        console.log(user);

        messageReply(
            msg.channel,
            `\`\`\`${JSON.stringify({
                meta: user.metadata,
                disabled: user.disabled,
                premium: userData.data()?.premium || false,
            })}\`\`\``
        );
    },
    display: false,
    description: 'List members data as admin',
});

interface StaffArgs {
    member: User;
}
