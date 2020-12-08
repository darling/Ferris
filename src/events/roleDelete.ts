import { client } from '../app';
import { Guild, MessageEmbed, Role } from 'discord.js';
import { ILoggingProps, isLoggable, newLog } from '../util/webhookLogging';
import { getLoggingProps } from '../util/db/config';
import { updateRole } from '../util/db/roles';

client.on('roleDelete', async (role: Role) => {
    const guild: Guild = role.guild;

    updateRole(guild.id, role);
    
    const embed = new MessageEmbed();

    embed.setDescription(`<@&${role.id}> has been deleted.`);
    embed.setTimestamp();
    embed.setFooter(`ID: ${role.id}`);
    embed.setColor(16548225);
    embed.setTitle('Role Deleted');

    await newLog('ROLE_DELETED', guild.id, embed);
});
