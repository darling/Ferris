import { client } from '../app';
import { IDatabaseSchema } from '../util/databaseFunctions';
import { TextChannel } from 'discord.js';
import { serverConfigs } from '../util/serverInfo';

client.on('guildBanAdd', (guild) => {
    let guildConfig: IDatabaseSchema = serverConfigs.get(guild.id);
    if ( !guildConfig.logging ) return;

    if((guildConfig.logging.subs & 3)) {
        console.log("CONFIG", guildConfig.logging.subs);
    }

    const logChannelId: string | null = guildConfig.logging.channel

    if (logChannelId === null) return;

    const logChannel = client.channels.cache.get(logChannelId);
    if (logChannel)
        (logChannel as TextChannel).send('Member banned');
});
