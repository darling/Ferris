import { client } from '../app';
import { Guild, MessageEmbed, Role } from 'discord.js';
import { newLog } from '../util/webhookLogging';
import { isDeepStrictEqual } from 'util';
import { updateRole } from '../util/db/roles';

client.on('roleUpdate', async (role: Role, newRole: Role) => {
    const guild: Guild = role.guild;

    updateRole(guild.id, newRole);

    if (role.rawPosition !== newRole.rawPosition) return;

    const embed = new MessageEmbed();

    const differentKeys = deepDif(role, newRole);

    let outputDesk: string = `<@&${role.id}> was changed.\n\n`;

    differentKeys.forEach((val) => {
        outputDesk += `${
            val.charAt(0).toUpperCase() + val.slice(1)
        } changed from \`${JSON.stringify((role as any)[val])}\` to \`${JSON.stringify(
            (newRole as any)[val]
        )}\`.\n`;
    });

    embed.setDescription(`${outputDesk}`);
    embed.setTimestamp();
    embed.setFooter(`ID: ${role.id}`);
    embed.setColor(6869905);
    embed.setTitle('Role Updates');

    await newLog('ROLE_UPDATED', guild.id, embed);
});

function deepDif(first: Role, second: Role) {
    return Object.keys(second).filter((roleProp: string) => {
        return !isDeepStrictEqual((first as any)[roleProp], (second as any)[roleProp]);
    });
}
