import { GuildMember, MessageEmbed } from 'discord.js';
import { client } from '../app';
import { ILoggingProps, updateUserCount } from '../util/databaseFunctions';
import { getConfig, getLoggingProps } from '../util/db/config';
import { isLoggable, newLog } from '../util/webhookLogging';

client.on('guildMemberAdd', async (member) => {
    updateUserCount(member.guild);

    let loggingProps: ILoggingProps | undefined = getLoggingProps(member.guild.id);
    if (!isLoggable('MEMBER_JOINED', member.guild.id) && loggingProps) {
        const embed = new MessageEmbed();

        embed.setDescription(`<@${member.id}> has joined.`);
        embed.setTimestamp();
        const avURL = (member as GuildMember).user.avatarURL();
        if (avURL) embed.setThumbnail(avURL);
        embed.setFooter(`ID: ${member.id}`);
        embed.setColor(6869905);
        embed.setTitle('Member Joined');

        await newLog(member.guild.id, embed);
    }

    const config = getConfig(member.guild.id);
    if (config?.auto_role) {
        const roleId = config.auto_role;
        member.roles.add(roleId);
    }
});
