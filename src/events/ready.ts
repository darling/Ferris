import { client } from '../app';
import { serverConfigs } from '../util/serverInfo';
import { watchGuild } from '../util/databaseFunctions';
import runSchedule from '../util/scheduleHandler';

client.on('ready', () => {
    const user = client.user;

    if (!user) throw Error('User is undefined but bot is ready?');

    console.log(`Logged in as ${user.tag}`);

    user.setActivity('commands', {
        type: 'LISTENING',
        url: 'https://github.com/darling/Ferris',
    });

    runSchedule();

    client.guilds.cache.forEach(async (guild) => {
        if (!serverConfigs.has(guild.id)) {
            await watchGuild(guild);
        }
    });
});
