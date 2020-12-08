import { client } from '../app';
import { Guild, MessageEmbed } from 'discord.js';
import {newGuild} from './../util/db/guild'
import { newLog } from '../util/webhookLogging';
import isEqual from 'lodash.isequal';

client.on('guildUpdate', (oldGuild: Guild, guild: Guild) => {
    newGuild(guild);

    const embed = new MessageEmbed();

    const differentKeys = deepDif(oldGuild, guild);

    embed.setTitle('Guild Updated')

    let output = '';
    
    differentKeys.forEach((val) => {
        output += `${
            val.charAt(0).toUpperCase() + val.slice(1)
        } changed from \`${JSON.stringify((oldGuild as any)[val])}\` to \`${JSON.stringify(
            (guild as any)[val]
        )}\`.\n`;
    });

    embed.setDescription(output)
    embed.setTimestamp()
    embed.setFooter(`ID: ${guild.id}`)

    newLog('GUILD_UPDATE', guild.id, embed);
});

function deepDif(first: Guild, second: Guild) {
    return Object.keys(second).filter((roleProp: string) => {
        if (['embedEnabled', 'maximumPresences', 'features'].includes(roleProp)) return;
        return !isEqual((first as any)[roleProp], (second as any)[roleProp]);
    });
}
