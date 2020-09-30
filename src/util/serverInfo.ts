import Enmap from 'enmap';
import { Webhook } from 'discord.js';

const pendingUnpunishments = new Map();
const serverConfigs = new Enmap()
const loggingHooks = new Map<string, Webhook>()

export { pendingUnpunishments, serverConfigs, loggingHooks };
