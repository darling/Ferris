import { client } from '../app';
import { updateUserCount } from '../util/databaseFunctions';

client.on('guildMemberAdd', (member) => {
    updateUserCount(member.guild);
});
