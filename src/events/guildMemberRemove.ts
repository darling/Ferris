import { GuildMember, MessageEmbed } from 'discord.js';
import { client } from '../app';
import { IDatabaseSchema, ILoggingProps, updateUserCount } from '../util/databaseFunctions';
import { getLoggingProps } from '../util/db/config';
import { serverConfigs } from '../util/serverInfo';
import { isLoggable, newLog } from '../util/webhookLogging';

client.on('guildMemberRemove', async (member) => {
    updateUserCount(member.guild);

    let loggingProps: ILoggingProps | undefined = getLoggingProps(member.guild.id);
    if (!loggingProps) return;

    const auditKick = await member.guild.fetchAuditLogs({
        type: 'MEMBER_KICK',
        limit: 1,
    });

    const lastAudit = auditKick.entries.first();
    if (!lastAudit) return;

    if (
        isLoggable('MEMBER_KICKED', member.guild.id) ||
        loggingProps ||
        Date.now() - lastAudit.createdAt.getTime() > 5000
    ) {
        if (isLoggable('MEMBER_LEFT', member.guild.id)) return;
        const embed = new MessageEmbed();

        embed.setDescription(`<@${member.id}> has left.`);
        embed.setTimestamp();
        const avURL = (member as GuildMember).user.avatarURL();
        if (avURL) embed.setThumbnail(avURL);
        embed.setFooter(`ID: ${member.id}`);
        embed.setColor(16548225);
        embed.setTitle('Member Left');

        await newLog(member.guild.id, embed);
        return;
    }

    const embed = new MessageEmbed();

    embed.setDescription(
        `<@${member.id}> was kicked!\nCheck the Audit Logs for more details on who kicked.`
    );
    embed.setTimestamp();
    const avURL = (member as GuildMember).user.avatarURL();
    if (avURL) embed.setThumbnail(avURL);
    embed.setFooter(`ID: ${member.id}`);
    embed.setColor(16548225);
    embed.setTitle('Member Kicked');

    await newLog(member.guild.id, embed);
});
