import { client } from '../app';
import { Guild, MessageEmbed, Role } from 'discord.js';
import { IDatabaseSchema, updateRole } from '../util/databaseFunctions';
import { serverConfigs } from '../util/serverInfo';
import { isLoggable, newLog } from '../util/webhookLogging';

client.on('roleCreate', async (role: Role) => {
    updateRole(role.guild.id, role);

    const guild: Guild = role.guild;

    let guildConfig: IDatabaseSchema | undefined = serverConfigs.get(guild.id);
    if (isLoggable('ROLE_CREATED', guild.id) || !guildConfig || !guildConfig.logging) return;

    const embed = new MessageEmbed();

    embed.setDescription(`<@&${role.id}> has been created.`);
    embed.setTimestamp();
    embed.setFooter(`ID: ${role.id}`);
    embed.setColor(6869905);
    embed.setTitle('Role Created');

    await newLog(guild.id, embed);
});
