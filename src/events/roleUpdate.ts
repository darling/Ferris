import { client } from '../app';
import { Role } from 'discord.js';
import { updateGuild } from '../util/databaseFunctions';

client.on('roleUpdate', (role: Role, newRole: Role) => {
    updateGuild(newRole.guild);
});
