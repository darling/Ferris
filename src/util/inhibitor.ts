import { Collection, Guild, Message } from 'discord.js';
import { ICommand } from '../types/commands';

export const inhibitors = new Collection<
    string,
    (msg: Message, command: ICommand, guild?: Guild) => Promise<boolean>
>();
