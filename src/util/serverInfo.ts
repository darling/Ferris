import Enmap from 'enmap';
import { Webhook } from 'discord.js';
import { IDatabaseSchema } from './databaseFunctions';

const pendingUnpunishments = new Map();
const serverConfigs = new Enmap<string, IDatabaseSchema>();
const loggingHooks = new Map<string, Webhook>();

export { pendingUnpunishments, serverConfigs, loggingHooks };
