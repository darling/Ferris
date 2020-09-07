import { FerrisClient } from '../../app';
import { Message } from 'discord.js';

interface RunCommand {
    (client: FerrisClient, msg: Message, args: string[]): void;
}

export { RunCommand };
