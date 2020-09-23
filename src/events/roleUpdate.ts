import { client } from '../app';
import { Role } from 'discord.js';
import { newGuild } from '../util/databaseFunctions';

client.on('roleUpdate', (role: Role, newRole: Role) => {
    newGuild(newRole.guild);
});
