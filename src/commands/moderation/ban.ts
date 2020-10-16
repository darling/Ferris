import { Message, GuildMember, MessageEmbed, Guild, Collection } from 'discord.js';
import { admin, FerrisClient, firestore } from '../../app';

import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';
import { EmbedColors } from '../../util/embed';

client.commands.set('ban', {
    name: 'ban',
    arguments: [
        {
            name: 'user',
            type: 'member',
            required: true,
            missing: (msg) => {},
        },
        {
            name: 'time',
            type: 'duration',
            required: false,
        },
        {
            name: 'reason',
            type: '...string',
            required: false,
        },
    ],
    // permissionLevels: [PermissionLevels.BOT_DEV],
    botGuildPerms: ['BAN_MEMBERS'],
    userGuildPerms: ['BAN_MEMBERS'],
    run: (msg, args: BanArgs) => {
        msg.channel.send(JSON.stringify(args, null, 2));
    },
});

interface BanArgs {
    user: GuildMember;
    time?: string;
    reason?: string;
}

// const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
//     const member: GuildMember | null = msg.member;
//     if (member === null) {
//         return;
//     }

//     const guild: Guild | null = msg.guild;
//     if (guild === null) {
//         return;
//     }

//     const guildClient: GuildMember | null = guild.me;
//     if (guildClient === null) {
//         msg.reply('am I even in this server?');
//         return;
//     }

//     if (!member.hasPermission('BAN_MEMBERS')) {
//         msg.reply('You do not have permission to ban members.');
//         return;
//     }

//     if (!guildClient.hasPermission('BAN_MEMBERS')) {
//         msg.reply('I do not have permission to ban members.');
//         return;
//     }

//     const mentions: Collection<string, GuildMember> | null = msg.mentions.members;
//     if (mentions === null) {
//         msg.reply('please mention a user to ban.');
//         return;
//     }

//     let bannedMember: GuildMember | undefined = mentions.first();
//     if (bannedMember === undefined) return;

//     if (!bannedMember.bannable) {
//         msg.reply('I can not ban this member.');
//         return;
//     }

//     bannedMember.ban({ days: 3, reason: args.join(' ') }).then((member) => {
//         const embed = new MessageEmbed();
//         embed.setColor(EmbedColors.WHITE);
//         embed.setTitle(member.user.username + ' has been banned!');
//         embed.setThumbnail('https://i.imgur.com/NG469Iv.png');
//         embed.setAuthor(msg.author.tag, msg.author.avatarURL()!);
//         msg.channel.send(embed);
//     });

//     const timeGiven = admin.firestore.Timestamp.now();

//     const docData = {
//         guild: guild.id,
//         channel: msg.channel.id,
//         completed: false,
//         desc: args.join(' '),
//         type: 'ban',
//         timeGiven: timeGiven,
//         author: member.id,
//     };

//     const document = firestore
//         .collection('guilds')
//         .doc(guild.id)
//         .collection('punishments')
//         .doc(bannedMember.id);

//     document.set(docData);
// };
