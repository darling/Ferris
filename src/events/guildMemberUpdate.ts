import { GuildMember, MessageEmbed } from 'discord.js';
import { client } from '../app';
import { getConfig, getLoggingProps } from '../util/db/config';
import { updateGuildMemberCount } from '../util/db/guild';
import { ILoggingProps, isLoggable, newLog } from '../util/webhookLogging';

type MemberUpdate = 'profile' | 'role';

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const guild = newMember.guild;

    updateGuildMemberCount(newMember.guild);

    let loggingProps: ILoggingProps | undefined = getLoggingProps(oldMember.guild.id);
    
    if (oldMember.roles.cache.size != newMember.roles.cache.size) {
        const embed = new MessageEmbed();

        let description = `<@${newMember.id}> roles have been updated.\n`;

        const roles = oldMember.roles.cache.difference(newMember.roles.cache)

        const given = !oldMember.roles.cache.has(roles.first()?.id || '');

        roles.forEach((role) => {
            if (role.deleted) return;
            description += `\n${given ? '+' : '-'} <@&${role.id}>`;
        })

        embed.setDescription(description);
        embed.setTimestamp();
        embed.setFooter(`ID: ${newMember.id}`);
        embed.setColor(6869905);
        embed.setTitle(`Role ${given ? 'Given' : 'Removed'}`);

        await newLog(given ? 'ROLE_GIVEN' : 'ROLE_REMOVED', guild.id, embed);
    }
});
