import { Guild, GuildMember, MessageEmbed } from 'discord.js';
import moment from 'moment';

import { client } from '../../app';

client.commands.set('whois', {
    name: 'whois',
    arguments: [
        {
            name: 'user',
            type: 'member',
            required: false,
        },
    ],
    run: (msg, args: WhoisArgs, guild) => {
        const member = args.user || msg.member;
        if (!member || !guild) return;

        const embed = new MessageEmbed();

        embed.setColor(16646143);

        embed.setTitle(`${member.user.tag}${member.user.bot ? ' **BOT**' : ''}`);
        if (member?.nickname) embed.setDescription(`Nickname: ${member.nickname}`);
        embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

        let roles = member.roles.cache.array();

        embed.addField('Roles', roles ? roles : 'No  roles', true);

        embed.addField('Notes', `None.`, true);

        embed.setFooter(`ID: ${member.user.id}  •  UTC`);

        embed.addField(
            'Joined',
            `${moment(member?.joinedTimestamp).utc().format('LLLL')}, about ${moment(
                member?.joinedTimestamp
            ).fromNow()}.`
        );

        embed.addField(
            'Created',
            `${moment(member.user.createdTimestamp).utc().format('LLLL')}, about ${moment(
                member.user.createdTimestamp
            ).fromNow()}.`
        );

        msg.channel.send(embed);
    },
    description:
        'The `whois` command allows you to **gain information** on any member in the server __including yourself!__ This includes __roles, join date, and more! __',
});

interface WhoisArgs {
    user?: GuildMember;
}
