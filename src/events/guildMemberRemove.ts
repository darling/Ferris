import { GuildMember, MessageEmbed } from 'discord.js';
import { client } from '../app';
import { getLoggingProps } from '../util/db/config';
import { updateGuildMemberCount } from '../util/db/guild';
import { EmbedColors } from '../util/embed';
import { ILoggingProps, isLoggable, newLog } from '../util/webhookLogging';

client.on('guildMemberRemove', async (member) => {
    updateGuildMemberCount(member.guild);

    if (member.id === client.user?.id) {
        // If the user is the bot...
        return;
    }

    let loggingProps: ILoggingProps | undefined = getLoggingProps(member.guild.id);
    if (!loggingProps) return;

    const auditKick = await member.guild.fetchAuditLogs({
        type: 'MEMBER_KICK',
        limit: 1,
    });

    const lastAudit = auditKick.entries.first();

    if (lastAudit && Date.now() - lastAudit.createdAt.getTime() < 5000) {
        const embed = new MessageEmbed();

        embed.setDescription(
            `<@${member.id}> was kicked!\nCheck the Audit Logs for more details on who kicked.`
        );
        embed.setTimestamp();
        const avURL = (member as GuildMember).user.avatarURL();
        if (avURL) embed.setThumbnail(avURL);
        embed.setFooter(`ID: ${member.id}`);
        embed.setColor(EmbedColors.RED);
        embed.setTitle('Member Kicked');

        await newLog('MEMBER_KICKED', member.guild.id, embed);
        return;
    }

    // if (isLoggable('MEMBER_LEFT', member.guild.id)) return;
    const embed = new MessageEmbed();

    embed.setDescription(`<@${member.id}> has left.`);
    embed.setTimestamp();
    const avURL = (member as GuildMember).user.avatarURL();
    if (avURL) embed.setThumbnail(avURL);
    embed.setFooter(`ID: ${member.id}`);
    embed.setColor(EmbedColors.RED);
    embed.setTitle('Member Left');

    await newLog('MEMBER_LEFT', member.guild.id, embed);
    return;
});
