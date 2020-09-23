import { client } from '../app';

// Instead of grabbing the prefix each time, we can store the current prefix of any server this shard looks at, and update it when the database updates.
import { serverConfigs } from '../util/serverinfo';
import { Guild, TextChannel } from 'discord.js';
import { IDatabaseSchema } from '../util/databaseFunctions';

client.on('messageDelete', (msg) => {
    if(msg.author?.bot) return;

    if(msg.channel.type === "dm" || msg.channel.type === "news") return;

    const guild: Guild | null = msg.guild;
    if (guild === null) return;

    let guildConfig: IDatabaseSchema = serverConfigs.get(guild.id);

    if((guildConfig.logTypes & 1)) {
        console.log("CONFIG", guildConfig.logTypes);
    }

    const logChannelId: string | null = guildConfig.loggingChannel

    if (logChannelId === null) return;

    const logChannel = client.channels.cache.get(logChannelId);
    if (logChannel) (logChannel as TextChannel).send('Message Deleted');
})