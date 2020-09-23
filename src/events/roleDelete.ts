import { client } from '../app';
import { Role } from 'discord.js';
import { newGuild } from '../util/databaseFunctions';

client.on('roleDelete', (role: Role) => {
    newGuild(role.guild);
});
