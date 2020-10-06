import { Guild, Message, MessageEmbed, User } from 'discord.js';
import moment from 'moment';
import { FerrisClient } from '../app';
import { serverConfigs } from '../util/serverInfo';

import { RunCommand } from './util/commandinterface';

const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
    const guild: Guild | null = msg.guild;
    if (!guild) return;

    const person = msg.mentions.members?.first();

    const embed = new MessageEmbed();
    embed.setColor(16646143);
    embed.setTitle('List Warns');

    if (!person) {
        embed.setDescription('Please mention a person to check their profile.');
        msg.channel.send(embed);
        return;
    }

    let memberWarns: any[any] = serverConfigs.get(guild.id, 'warns.' + person.id);

    if (!memberWarns) {
        embed.setTitle('List Warns');
        embed.setDescription(`<@${person.id}> does not have any warnings on them.`);
        msg.channel.send(embed);
        return;
    }

    const keys = Object.keys(memberWarns);

    embed.setTitle('Warns for ' + person.user.tag);
    embed.setTimestamp();
    embed.setFooter(`ID: ${person.id}`);
    embed.setDescription(person.user.username + ' has ' + keys.length + ' warns.');

    keys.forEach((timeGiven, count) => {
        const warn = memberWarns[timeGiven];
        const time = moment(+timeGiven).format('MMMM Do YYYY, h:mm a [PST]');
        embed.addField(
            'Warn # ' + (count + 1),
            `**Time: **${time}\n**By: **<@${warn.by}>\n**Reason:\n**${warn.reason}`,
            false
        );
    });

    msg.channel.send(embed).catch((err: Error) => {
        console.error(err);
    });
};

export { run };
