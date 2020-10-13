import { client } from '../app';
import { Guild, MessageEmbed, Role, RoleData } from 'discord.js';
import { IDatabaseSchema, updateRole } from '../util/databaseFunctions';
import { serverConfigs } from '../util/serverInfo';
import { isLoggable, newLog } from '../util/webhookLogging';
import { isDeepStrictEqual } from 'util';

client.on('roleUpdate', async (role: Role, newRole: Role) => {
    updateRole(newRole.guild.id, newRole);

    if (role.rawPosition !== newRole.rawPosition) return;

    const guild: Guild = role.guild;

    let guildConfig: IDatabaseSchema | undefined = serverConfigs.get(guild.id);
    if (isLoggable('ROLE_UPDATED', guild.id) || !guildConfig || !guildConfig.logging) return;

    const embed = new MessageEmbed();

    const differentKeys = Object.keys(newRole).filter((roleProp: string) => {
        return !isDeepStrictEqual((role as any)[roleProp], (newRole as any)[roleProp]);
    });

    console.log(JSON.stringify(role, null, 2), JSON.stringify(newRole, null, 2));

    let outputDesk: string = `<@&${role.id}> was changed.\n\n`;

    differentKeys.forEach((val) => {
        outputDesk += `${val.charAt(0).toUpperCase() + val.slice(1)} changed from \`${
            (role as any)[val]
        }\` to \`${(newRole as any)[val]}\`.\n`;
    });

    embed.setDescription(`${outputDesk}`);
    embed.setTimestamp();
    embed.setFooter(`ID: ${role.id}`);
    embed.setColor(6869905);
    embed.setTitle('Role Updates');

    await newLog(guild.id, embed);
});
