import { client } from '../app';
import { Role } from 'discord.js';
import { newGuild } from '../util/databaseFunctions';

client.on('roleCreate', (role: Role) => {
    newGuild(role.guild);
});
