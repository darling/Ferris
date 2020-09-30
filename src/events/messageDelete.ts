import { client } from '../app';

import { Guild, MessageEmbed } from 'discord.js';
import { newLog } from '../util/webhookLogging';
import { IDatabaseSchema } from '../util/databaseFunctions';
import { serverConfigs } from '../util/serverInfo';

client.on('messageDelete', async (msg) => {
    if(!msg.author || msg.author.bot) return;

    if(msg.channel.type === "dm" || msg.channel.type === "news") return;

    const guild: Guild | null = msg.guild;
    if (guild === null) return;

    let guildConfig: IDatabaseSchema = serverConfigs.get(guild.id);
    if ( !guildConfig.logging ) return;

    if(!(guildConfig.logging.subs & 1)) return;

    await newLog(guild.id, new MessageEmbed({ author: { name: `${msg.author.tag} ID: ${msg.author.id}`}, title: `Message deleted by ${msg.author.username}`, description: `${msg.content}`}));
})