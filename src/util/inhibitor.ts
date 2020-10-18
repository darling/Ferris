import { Collection, Guild, Message } from 'discord.js';
import { ICommand, PermissionLevels } from '../types/commands';

export const inhibitors = new Collection<
    string,
    (msg: Message, command: ICommand, guild?: Guild) => Promise<boolean>
>();

export const permissionLevelTests = new Map<
    PermissionLevels,
    (msg: Message, command: ICommand, guild?: Guild) => Promise<boolean>
>();
