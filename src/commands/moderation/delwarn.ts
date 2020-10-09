import { Guild, Message } from 'discord.js';
import { FerrisClient } from '../../app';
import { deleteWarn } from '../../util/databaseFunctions';
import { serverConfigs } from '../../util/serverInfo';

import { RunCommand } from '../../util/commandinterface';

const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
    const guild: Guild | null = msg.guild;
    if (!guild) return;

    const person = msg.mentions.members?.first();
    if (!person) {
        msg.reply('You did not mention anyone!');
        return;
    }

    let bigAssString: any = serverConfigs.get(guild.id, 'warns.' + person.id);
    const timestamp = Object.keys(bigAssString)[+args[1] - 1];

    deleteWarn(guild.id, person.id, timestamp);
};
export { run };
