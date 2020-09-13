import { Message, MessageEmbed, User } from 'discord.js';
import { FerrisClient } from '../app';

import { RunCommand } from './util/commandinterface';
import { getAvatar } from './util/users';
import moment from 'moment';

const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
    let user: User | undefined = msg.mentions.users.first();

    if (args.length < 1) {
        user = msg.author;
    }

    if (user === undefined) {
        try {
            user = client.users.cache.get(args[0]);
        } catch (e) {
            console.error(e);
        }
    }

    if (user === undefined) {
        return;
    }

    const member = msg.guild?.member(user);
    if (member === undefined) return;

    const embed = new MessageEmbed();

    embed.setColor(16646143);

    embed.setTitle(`${user.tag}${user.bot ? ' **BOT**' : ''}`);
    if (member?.nickname) embed.setDescription(`Nickname: ${member?.nickname}`);
    embed.setThumbnail(getAvatar(user.id, user.avatar!));

    let roles = member?.roles.cache.array();

    embed.addField('Roles', roles ? roles : "No  roles", true);

    embed.addField('Current Punishments', `None.`, true);

    embed.setFooter(`ID: ${user.id}  •  UTC`);

    embed.addField(
        'Joined',
        `${moment(member?.joinedTimestamp).utc().format('LLLL')}, about ${moment(
            member?.joinedTimestamp
        ).fromNow()}.`,

    );

    embed.addField(
        'Created',
        `${moment(user.createdTimestamp).utc().format('LLLL')}, about ${moment(
            user.createdTimestamp
        ).fromNow()}.`,

    );

    msg.channel.send(embed);
};

export { run };
