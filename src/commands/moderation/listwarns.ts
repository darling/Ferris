import { serverConfigs } from '../../util/serverInfo';
import { GuildMember, MessageEmbed } from 'discord.js';
import { getAvatar } from '../../util/users';
import moment from 'moment';
import { client } from '../../app';
import { EmbedColors } from '../../util/embed';

client.commands.set('listwarns', {
    name: 'listwarns',
    arguments: [
        {
            name: 'user',
            type: 'member',
            required: false,
        },
    ],
    run: (msg, args: ListWarnsArgs, guild) => {
        const member = args.user || msg.member;
        if (!member || !guild) return;

        const embed = new MessageEmbed();

        embed.setColor(EmbedColors.WHITE);

        embed.setTitle(`${member.user.username}'s warns.`);
        embed.setThumbnail(getAvatar(member.user.id, member.user.avatar!));
        embed.setFooter(`ID: ${member.user.id}  •  UTC`);

        let memberWarns: any[any] = serverConfigs.get(guild.id)?.warns[member.id];

        if (!memberWarns) {
            embed.setDescription('This user has no warnings.');
            msg.channel.send(embed);
            return;
        }

        const keys = Object.keys(memberWarns);

        keys.forEach((timeGiven, count) => {
            const warn = memberWarns[timeGiven];
            const time = moment(+timeGiven).format('MMMM Do YYYY, h:mm a [PST]');
            embed.addField(
                'Warn # ' + (count + 1),
                `**Time: **${time}\n**By: **<@${warn.by}>\n**Reason:\n**${warn.reason}`,
                false
            );
        });

        msg.channel.send(embed);
    },
});

interface ListWarnsArgs {
    user?: GuildMember;
}

// const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
//     const guild: Guild | null = msg.guild;
//     if (!guild) return;

//     const person = msg.mentions.members?.first();

//     const embed = new MessageEmbed();
//     embed.setColor(16646143);
//     embed.setTitle('List Warns');

//     if (!person) {
//         embed.setDescription('Please mention a person to check their profile.');
//         msg.channel.send(embed);
//         return;
//     }

//     let memberWarns: any[any] = serverConfigs.get(guild.id, 'warns.' + person.id);

//     if (!memberWarns) {
//         embed.setTitle('List Warns');
//         embed.setDescription(`<@${person.id}> does not have any warnings on them.`);
//         msg.channel.send(embed);
//         return;
//     }

//     embed.setTitle('Warns for ' + person.user.tag);
//     embed.setTimestamp();
//     embed.setFooter(`ID: ${person.id}`);
//     embed.setDescription(person.user.username + ' has ' + keys.length + ' warns.');

//     msg.channel.send(embed).catch((err: Error) => {
//         console.error(err);
//     });
// };
