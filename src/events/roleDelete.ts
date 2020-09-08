import { client } from '../app';
import { Role } from 'discord.js';
import { updateGuild } from '../util/databaseFunctions';

client.on('roleDelete', (role: Role) => {
    updateGuild(role.guild);
});
