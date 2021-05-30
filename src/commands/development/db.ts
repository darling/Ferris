import { Guild } from 'discord.js';
import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { getConfig } from '../../util/db/config';
import { serverConfigs } from '../../util/serverInfo';

client.commands.set('db', {
    name: 'db',
    arguments: [
        {
            name: 'guild_id',
            type: 'guild',
            required: false,
        },
    ],
    permissionLevels: [PermissionLevels.BOT_DEV],
    run: async (msg, args: EchoArgs, guild) => {
        const guildInfo =
            (await getConfig(args.guild_id?.id || guild?.id || '')) || 'No config found';

        msg.channel.send(`\`\`\`JSON\n${JSON.stringify(guildInfo, null, 2)}\`\`\``);
    },
    display: false,
    description: 'developer only',
});

interface EchoArgs {
    guild_id?: Guild;
}
