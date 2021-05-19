import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';

client.commands.set('basic', {
    name: 'basic',
    arguments: [],
    permissionLevels: [PermissionLevels.BOT_DEV],
    run: async (msg, args: Args) => {
        const guild = await client.guilds.cache.get('601618014252826624')?.fetch();
        console.log((await guild!.members.fetch()).array().map((mem) => mem.id));
    },
    display: false,
});

interface Args {}
