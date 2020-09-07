import { Message } from 'discord.js';
import { FerrisClient, db } from '../app';

import { RunCommand } from './util/commandinterface';

const run: RunCommand = function (client: FerrisClient, msg: Message): void {
    if (!msg.guild) return;

    db.ref(`guilds/${msg.guild.id}/prefix`)
        .once('value')
        .then((snapshot) => {
            msg.channel.send(`PREFIX IS ${snapshot.val()}`);
        });
};

export { run };
