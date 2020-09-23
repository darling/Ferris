import { client } from '../app';
import { IDatabaseSchema, updateUserCount } from '../util/databaseFunctions';
import { Guild, TextChannel } from 'discord.js';
import { serverConfigs } from '../util/serverinfo';

client.on('guildBanAdd', (guild, member) => {
    let guildConfig: IDatabaseSchema = serverConfigs.get(guild.id);

    if((guildConfig.logTypes & 3)) {
        console.log("CONFIG", guildConfig.logTypes);
    }

    const logChannelId: string | null = guildConfig.loggingChannel

    if (logChannelId === null) return;

    const logChannel = client.channels.cache.get(logChannelId);
    if (logChannel) (logChannel as TextChannel).send('Member banned');
});
