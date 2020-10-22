import { Message, MessageEmbed } from 'discord.js';
import { client, FerrisClient } from '../../app';
import { PermissionLevels } from '../../types/commands';

client.commands.set('test', {
    name: 'test',
    arguments: [],
    // permissionLevels: [PermissionLevels.BOT_DEV],
    // userGuildPerms: ['ADMINISTRATOR'],
    run: (msg, args: TestArgs, guild) => {},
});

interface TestArgs {
    first?: string;
    second?: string;
    third?: string;
}
