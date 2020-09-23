import { client } from '../app';
import { serverConfigs } from '../util/serverinfo';
import { watchGuild } from '../util/databaseFunctions';

client.on('ready', () => {
    if (client.user)
        console.log(`Logged in as ${client.user.tag}`);

    client.guilds.cache.forEach(async guild => {
        if (!serverConfigs.has(guild.id)) {
            await watchGuild(guild);
        }
    })
})