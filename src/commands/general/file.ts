import { Guild, Message } from 'discord.js';
import { FerrisClient } from '../../app';
import { IDatabaseSchema } from '../../util/databaseFunctions';
import { serverConfigs } from '../../util/serverInfo';

import { RunCommand } from '../../util/commandinterface';

const run: RunCommand = function (client: FerrisClient, msg: Message): void {
    // const guild: Guild | null = msg.guild;
    // if (!guild) return;

    console.log(__filename);

    // let guildConfig: IDatabaseSchema = serverConfigs.get(guild.id);
};

export { run };
