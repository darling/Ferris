import { Message } from 'discord.js';
import { FerrisClient, db } from '../../app';

import { RunCommand } from '../../util/commandinterface';

const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
    if (!msg.guild) return;

    db.ref(`guilds/${msg.guild.id}/prefix`).set(args[0]);
    msg.reply(`new prefix is ${args[0]}`);
};

export { run };
