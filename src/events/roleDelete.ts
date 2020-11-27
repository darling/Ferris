import { client } from '../app';
import { Guild, MessageEmbed, Role } from 'discord.js';
import { IDatabaseSchema, ILoggingProps } from '../util/databaseFunctions';
import { serverConfigs } from '../util/serverInfo';
import { isLoggable, newLog } from '../util/webhookLogging';
import { getLoggingProps } from '../util/db/config';
import { updateRole } from '../util/db/roles';

client.on('roleDelete', async (role: Role) => {
    const guild: Guild = role.guild;

    updateRole(guild.id, role);

    let loggingProps: ILoggingProps | undefined = getLoggingProps(guild.id);
    if (isLoggable('ROLE_DELETED', guild.id) || !loggingProps) return;

    const embed = new MessageEmbed();

    embed.setDescription(`<@&${role.id}> has been deleted.`);
    embed.setTimestamp();
    embed.setFooter(`ID: ${role.id}`);
    embed.setColor(16548225);
    embed.setTitle('Role Deleted');

    await newLog(guild.id, embed);
});
