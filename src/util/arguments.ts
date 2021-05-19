import { Collection, Message } from 'discord.js';
import { CommandArgument, ICommand } from '../types/commands';

export interface Argument {
    name: string;
    execute: (
        arg: CommandArgument,
        parameter: string[],
        msg: Message,
        command: ICommand
    ) => unknown;
    example: () => string;
    description: string;
}

export const argumentList = new Collection<string, Argument>();
