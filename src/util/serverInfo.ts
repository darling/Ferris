import Enmap from 'enmap';
import { Collection, Webhook } from 'discord.js';
import { IDatabaseSchema } from './databaseFunctions';
import { IConfigSchema } from './db/config';

export const pendingUnpunishments = new Map();
export const serverConfigs = new Collection<string, IConfigSchema>();
export const loggingHooks = new Map<string, Webhook>();
