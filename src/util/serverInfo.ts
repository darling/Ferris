import { Collection } from 'discord.js';
import { IConfigSchema } from './db/config';

export const pendingUnpunishments = new Map();
export const serverConfigs = new Collection<string, IConfigSchema>();
