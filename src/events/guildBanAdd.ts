import { client } from '../app';
import { IDatabaseSchema } from '../util/databaseFunctions';
import { MessageEmbed, TextChannel } from 'discord.js';
import { serverConfigs } from '../util/serverInfo';
import { newLog } from '../util/webhookLogging';

client.on('guildBanAdd', async (guild, member) => {
    let guildConfig: IDatabaseSchema | undefined = serverConfigs.get(guild.id);
    if (!guildConfig || !guildConfig.logging) return;

    if (guildConfig.logging.subs & 3) {
        console.log('CONFIG', guildConfig.logging.subs);
    }

    const embed = new MessageEmbed();

    embed.setDescription(
        `<@${member.id}> was banned!\nCheck the Audit Logs for more details on who banned.`
    );
    embed.setTimestamp();
    const avURL = member.avatarURL();
    if (avURL) embed.setThumbnail(avURL);
    embed.setFooter(`ID: ${member.id}`);
    embed.setColor(16548225);
    embed.setTitle('Member Banned');

    await newLog(guild.id, embed);
});