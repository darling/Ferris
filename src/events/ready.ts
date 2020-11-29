import { client } from '../app';
import { serverConfigs } from '../util/serverInfo';
import runSchedule from '../util/scheduleHandler';
import { subscribeConfig } from '../util/db/config';
import { newGuild } from '../util/db/guild';

client.on('ready', () => {
    const user = client.user;

    if (!user) throw Error('User is undefined but bot is ready?');

    console.log(`Logged in as ${user.tag}`);

    user.setActivity(';help | ferris.gg', {
        type: 'PLAYING',
        url: 'https://github.com/darling/Ferris',
    });

    runSchedule();

    client.guilds.cache.forEach(async (guild) => {
        newGuild(guild);
        
        if (!serverConfigs.has(guild.id)) {
            subscribeConfig(guild.id);
        }
    });
});
