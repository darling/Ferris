import { Message } from 'discord.js';
import { FerrisClient } from '../app';

import { RunCommand } from './util/commandinterface';

const run: RunCommand = function (client: FerrisClient, msg: Message): void {
    msg.channel.send(`Pong!`).catch((err: Error) => {
        console.error(err);
    });
};

export { run };
