import { MessageAttachment } from 'discord.js';
import { includes, trim } from 'lodash';

import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { argumentList } from '../../util/arguments';

client.commands.set('command_export', {
    name: 'command_export',
    arguments: [],
    permissionLevels: [PermissionLevels.BOT_DEV],
    run: async (msg) => {
        const attachment = new MessageAttachment(
            Buffer.from(
                JSON.stringify(
                    client.commands
                        .filter((command) => command.display !== false || command.name === 'test')
                        .map((command) => {
                            let newcmd = command;
                            newcmd.description = trim(command.description, '\n\t  ');
                            return newcmd;
                        }),
                    null,
                    2
                ),
                'utf-8'
            ),
            'commanddata.json'
        );
        msg.channel.send('beep boop', attachment);
    },
    display: false,
});

client.commands.set('type_export', {
    name: 'type_export',
    arguments: [],
    permissionLevels: [PermissionLevels.BOT_DEV],
    run: async (msg) => {
        const attachment = new MessageAttachment(
            Buffer.from(JSON.stringify(argumentList, null, 2), 'utf-8'),
            'typedata.json'
        );
        msg.channel.send('beep boop', attachment);
    },
    display: false,
});

client.commands.set('et', {
    name: 'et',
    arguments: [],
    permissionLevels: [PermissionLevels.FERRIS_STAFF],
    run: async (msg, _args, guild) => {
        const cache = client.commands.keyArray();
        msg.channel.send(cache.join('\n'));
    },
    display: false,
});

client.commands.set('dg', {
    name: 'dg',
    arguments: [{ name: 'data', type: '...string', required: true }],
    run: async (msg, args: dgArgs, guild) => {
        msg.channel.send(`\`\`\`${JSON.stringify(args.data.replace(/\`/g, '`'))}\`\`\``);
    },
    display: false,
});

interface dgArgs {
    data: string;
}
