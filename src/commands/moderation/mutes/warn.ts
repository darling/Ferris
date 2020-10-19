import { addWarn } from '../../../util/databaseFunctions';

import { GuildMember } from 'discord.js';

import { client } from '../../../app';

client.commands.set('warn', {
    name: 'warn',
    guildOnly: true,
    arguments: [
        {
            name: 'user',
            type: 'member',
            required: true,
        },
        {
            name: 'reason',
            type: '...string',
            required: false,
        },
    ],
    run: (msg, args: PunishArgs, guild) => {
        if (!guild) return;

        addWarn(guild.id, args.user.id, msg.author.id, args.reason);
    },
});

interface PunishArgs {
    user: GuildMember;
    reason?: string;
}