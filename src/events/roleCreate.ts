import { client } from '../app';
import { Guild, MessageEmbed, Role } from 'discord.js';
import { ILoggingProps, isLoggable, newLog } from '../util/webhookLogging';
import { getLoggingProps } from '../util/db/config';
import { updateRole } from '../util/db/roles';

client.on('roleCreate', async (role: Role) => {
    const guild: Guild = role.guild;

    updateRole(guild.id, role);

    const embed = new MessageEmbed();

    embed.setDescription(`<@&${role.id}> has been created.`);
    embed.setTimestamp();
    embed.setFooter(`ID: ${role.id}`);
    embed.setColor(6869905);
    embed.setTitle('Role Created');

    await newLog('ROLE_CREATED', guild.id, embed);
});
