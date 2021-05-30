import { Guild, User } from 'discord.js';
import { admin, client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { deleteProperty } from '../../util/db/config';
import { messageReply } from '../../util/interactions/message';

client.commands.set('del', {
    name: 'del',
    arguments: [
        {
            name: 'guild',
            type: 'guild',
        },
        {
            name: 'property',
            type: 'string',
            literals: ['automod', 'prefix', 'logging'],
        },
    ],
    permissionLevels: [PermissionLevels.FERRIS_STAFF],
    run: async (msg, args: StaffArgs) => {
        deleteProperty(args.guild.id, args.property);

        messageReply(msg.channel, 'o7');
    },
    display: false,
    description: 'Delete data as admin',
});

interface StaffArgs {
    guild: Guild;
    property: 'automod' | 'prefix' | 'logging';
}
