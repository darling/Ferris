import { Message, MessageEmbed } from 'discord.js';
import { client, FerrisClient } from '../../app';

client.commands.set('test', {
    name: 'test',
    arguments: [],
    userGuildPerms: ['ADMINISTRATOR'],
    run: (msg, args: TestArgs) => {
        msg.channel.send(JSON.stringify(args));
    },
});

interface TestArgs {
    first?: string;
    second?: string;
    third?: string;
}
