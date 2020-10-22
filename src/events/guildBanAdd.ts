import { client } from '../app';
import { IDatabaseSchema, ILoggingProps } from '../util/databaseFunctions';
import { MessageEmbed, TextChannel } from 'discord.js';
import { serverConfigs } from '../util/serverInfo';
import { newLog } from '../util/webhookLogging';

client.on('guildBanAdd', async (guild, member) => {
    let loggingProps: ILoggingProps | undefined = serverConfigs.get(guild.id)?.config?.log_channel;
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
