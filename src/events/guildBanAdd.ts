import { client } from '../app';
import { MessageEmbed } from 'discord.js';
import { newLog } from '../util/webhookLogging';

client.on('guildBanAdd', async (guild, member) => {
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

    await newLog('BAN_ADDED', guild.id, embed);
});
