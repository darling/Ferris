import { client } from '../app';
import { Guild, MessageEmbed, Role } from 'discord.js';
import { IDatabaseSchema, ILoggingProps } from '../util/databaseFunctions';
import { serverConfigs } from '../util/serverInfo';
import { isLoggable, newLog } from '../util/webhookLogging';

client.on('roleDelete', async (role: Role) => {
    // deleteRole(role.guild.id, role);

    const guild: Guild = role.guild;

    let loggingProps: ILoggingProps | undefined = serverConfigs.get(guild.id)?.config?.log_channel;
    if (isLoggable('ROLE_DELETED', guild.id) || !loggingProps) return;

    const embed = new MessageEmbed();

    embed.setDescription(`<@&${role.id}> has been deleted.`);
    embed.setTimestamp();
    embed.setFooter(`ID: ${role.id}`);
    embed.setColor(16548225);
    embed.setTitle('Role Deleted');

    await newLog(guild.id, embed);
});
