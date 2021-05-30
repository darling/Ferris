import { Guild } from 'discord.js';
import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { getLogSubs } from '../../util/webhookLogging';

client.commands.set('loginfo', {
    name: 'loginfo',
    arguments: [],
    permissionLevels: [PermissionLevels.BOT_DEV],
    run: (msg, args: LogArgs, guild) => {
        if (!guild) return;
        const loggingProperties = getLogSubs(guild.id);

        msg.channel.send(`\`\`\`JSON\n${JSON.stringify(loggingProperties, null, 2)}\`\`\``);
    },
    display: false,
    description: 'developer only',
});

interface LogArgs {}
