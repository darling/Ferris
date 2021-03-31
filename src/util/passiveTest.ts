import { Collection, Message } from 'discord.js';
import { IWarning, IWarnings } from './db/warnings';

export const passiveTests = new Collection<
    string,
    (msg: Message) => Promise<IWarning | undefined>
>();
