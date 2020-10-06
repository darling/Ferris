import { Guild, Message } from 'discord.js';
import { FerrisClient } from '../app';
import { addWarn, IDatabaseSchema } from '../util/databaseFunctions';
import { serverConfigs } from '../util/serverInfo';

import { RunCommand } from './util/commandinterface';

const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
    const guild: Guild | null = msg.guild;
    if (!guild) return;

    const memberToWarn = msg.mentions.members?.first();
    if (!memberToWarn) {
        msg.reply('You did not mention anyone!');
        return;
    }

    args.shift();
    const reason = args.join(' ');

    addWarn(guild.id, memberToWarn.id, reason, msg.author.id);
};

export { run };
