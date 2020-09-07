import { client } from '../app';
import { updateUserCount } from '../util/databaseFunctions';

client.on('guildMemberRemove', (member) => {
    updateUserCount(member.guild);
});
