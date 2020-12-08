import { GuildMember, MessageEmbed } from 'discord.js';
import { client } from '../app';
import { getConfig, getLoggingProps } from '../util/db/config';
import { updateGuildMemberCount } from '../util/db/guild';
import { ILoggingProps, isLoggable, newLog } from '../util/webhookLogging';

client.on('guildMemberAdd', async (member) => {
    updateGuildMemberCount(member.guild);

    const embed = new MessageEmbed();

    embed.setDescription(`<@${member.id}> has joined.`);
    embed.setTimestamp();
    const avURL = (member as GuildMember).user.avatarURL();
    if (avURL) embed.setThumbnail(avURL);
    embed.setFooter(`ID: ${member.id}`);
    embed.setColor(6869905);
    embed.setTitle('Member Joined');

    await newLog('MEMBER_JOINED', member.guild.id, embed);

    const config = getConfig(member.guild.id);
    if (config?.auto_role) {
        const roleId = config.auto_role;
        member.roles.add(roleId);
    }
});
