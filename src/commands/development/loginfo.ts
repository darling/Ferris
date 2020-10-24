import { Guild } from 'discord.js';
import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { getLogSubs, logSubsToLogTypes, typesAsArray } from '../../util/webhookLogging';

client.commands.set('loginfo', {
    name: 'loginfo',
    arguments: [],
    permissionLevels: [PermissionLevels.BOT_DEV],
    run: (msg, args: LogArgs, guild) => {
        if (!guild) return;
        const loggingProperties = getLogSubs(guild.id);

        const answer = logSubsToLogTypes(loggingProperties || 0);

        msg.channel.send(`\`\`\`JSON\n${JSON.stringify(answer, null, 2)}\`\`\``);
    },
});

interface LogArgs {}
