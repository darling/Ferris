import { client } from '../app';

// Instead of grabbing the prefix each time, we can store the current prefix of any server this shard looks at, and update it when the database updates.
import { Guild, MessageEmbed } from 'discord.js';
import { newLog } from '../util/webhookLogging';

client.on('guildIntegrationsUpdate', async (guild) => {

    const embed = new MessageEmbed({
        title: `Integrations Update`,
        description: `The server's integrations has been updated, please check the audit log for more.`,
    });

    await newLog('INTEGRATIONS_UPDATE', guild.id, embed);
});
