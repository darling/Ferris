import Enmap from 'enmap';
import { Collection, Webhook } from 'discord.js';
import { IDatabaseSchema } from './databaseFunctions';

export const pendingUnpunishments = new Map();
export const serverConfigs = new Collection<string, IDatabaseSchema>();
export const loggingHooks = new Map<string, Webhook>();
