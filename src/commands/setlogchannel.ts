import { Message } from 'discord.js';
import { FerrisClient, db } from '../app';

import { RunCommand } from './util/commandinterface';
import { parseChannelId } from './util/parse';

const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
    if (!msg.guild) return;

    const channelId = parseChannelId(args[0]);

    db.ref(`guilds/${msg.guild.id}/loggingChannel`).set(channelId ? channelId : '');

    if (channelId === undefined) {
        msg.reply('Logging channel removed.');
        return;
    }

    msg.reply(`Logging channel is now <#${channelId}>`);
};

export { run };
