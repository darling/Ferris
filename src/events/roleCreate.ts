import { client } from '../app';
import { Role } from 'discord.js';
import { updateGuild } from '../util/databaseFunctions';

client.on('roleCreate', (role: Role) => {
    updateGuild(role.guild);
});
