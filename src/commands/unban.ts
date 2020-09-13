import { Message } from 'discord.js';
import { FerrisClient } from '../app';

import { RunCommand } from './util/commandinterface';
import { pendingUnpunishments } from '../util/serverinfo';
import { unbanUserFromGuild } from '../util/banFunctions';

const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
    const userId: string = args[0];
    if(userId === undefined) {
        return;
    }

    unbanUserFromGuild(msg.guild!, userId).then(() => {
        msg.react('✅')
    }).catch(() => {});

    if (pendingUnpunishments.has(userId)) {
        let unban = pendingUnpunishments.get(userId);
        clearTimeout(unban.event);
        const document = unban.document;
        document.ref.delete();
        pendingUnpunishments.delete(userId);
    }
};

export { run };
