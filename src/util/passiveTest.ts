import { Collection, Message } from 'discord.js';
import { IInfraction } from '../types/infraction';

export const passiveTests = new Collection<
    string,
    (msg: Message) => Promise<IInfraction | undefined>
>();
