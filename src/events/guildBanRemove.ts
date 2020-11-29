import { client } from '../app';
import { MessageEmbed } from 'discord.js';
import { serverConfigs } from '../util/serverInfo';
import { ILoggingProps, isLoggable, newLog } from '../util/webhookLogging';
import { getLoggingProps } from '../util/db/config';

client.on('guildBanRemove', async (guild, member) => {
    let loggingProps: ILoggingProps | undefined = getLoggingProps(guild.id);
    if (isLoggable('BAN_REMOVED', guild.id) || !loggingProps) return;

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
