import { client } from '../app';
import { Guild, MessageEmbed, Role } from 'discord.js';
import { IDatabaseSchema, ILoggingProps } from '../util/databaseFunctions';
import { serverConfigs } from '../util/serverInfo';
import { isLoggable, newLog } from '../util/webhookLogging';
import { getLoggingProps } from '../util/db/config';

client.on('roleCreate', async (role: Role) => {
    const guild: Guild = role.guild;

    let loggingProps: ILoggingProps | undefined = getLoggingProps(guild.id);
    if (isLoggable('ROLE_CREATED', guild.id) || !loggingProps) return;

    const embed = new MessageEmbed();

    embed.setDescription(`<@&${role.id}> has been created.`);
    embed.setTimestamp();
    embed.setFooter(`ID: ${role.id}`);
    embed.setColor(6869905);
    embed.setTitle('Role Created');

    await newLog(guild.id, embed);
});
