import { client } from '../app';
import { IDatabaseSchema } from '../util/databaseFunctions';
import { MessageEmbed, TextChannel } from 'discord.js';
import { serverConfigs } from '../util/serverInfo';
import { isLoggable, newLog } from '../util/webhookLogging';

client.on('guildBanRemove', async (guild, member) => {
    let guildConfig: IDatabaseSchema | undefined = serverConfigs.get(guild.id);
    if (isLoggable('BAN_REMOVED', guild.id) || !guildConfig || !guildConfig.logging) return;

    const embed = new MessageEmbed();

    embed.setDescription(
        `<@${member.id}> was unbanned!\nplease Check the Audit Logs for more details.`
    );
    embed.setTimestamp();
    const avURL = member.avatarURL();
    if (avURL) embed.setThumbnail(avURL);
    embed.setFooter(`ID: ${member.id}`);
    embed.setColor(6869905);
    embed.setTitle('Member Unbanned');

    await newLog(guild.id, embed);
});
