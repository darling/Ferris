import { client } from '../app';
import { MessageEmbed, TextChannel } from 'discord.js';
import { ILoggingProps, newLog } from '../util/webhookLogging';
import { getLoggingProps } from '../util/db/config';

client.on('guildBanAdd', async (guild, member) => {
    let loggingProps: ILoggingProps | undefined = getLoggingProps(guild.id);
    if (!loggingProps) return;

    if (loggingProps.subs & 3) {
        console.log('CONFIG', loggingProps.subs);
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
