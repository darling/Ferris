import { client, FerrisClient } from '../app';
import { Message } from 'discord.js';
import { readdirSync } from 'fs';

interface RunCommand {
    (client: FerrisClient, msg: Message, args: string[]): void;
}

export { RunCommand };
