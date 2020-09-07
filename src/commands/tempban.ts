import { Message, GuildMember, MessageEmbed } from 'discord.js';
import { FerrisClient, firestore, admin } from '../app';

import moment from 'moment';

import { RunCommand } from './util/commandinterface';
import ms from 'ms';

const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
    if (!msg.mentions.members) {
        msg.reply('please mention a user to ban.');
        return;
    }

    if (!msg.member?.hasPermission('BAN_MEMBERS')) {
        msg.reply('You do not have permission to ban members.');
        return;
    }

    if (!msg.guild?.me!.hasPermission('BAN_MEMBERS')) {
        msg.reply('You do not have permission to ban members.');
        return;
    }

    let bannedMember: GuildMember | undefined = msg.mentions.members.first();

    if (!bannedMember?.bannable) {
        msg.reply('I can not ban this member.');
        return;
    }

    let hasProperDateTime = /^\d{1,3}[sdmwh]{1}$/.test(args[1]);

    if (!hasProperDateTime) return;

    bannedMember.ban({ days: 3, reason: args.join(' ') }).then((member) => {
        let embed = new MessageEmbed();
        embed.setColor(16646143);
        embed.setTitle(member.user.username + ' has been temp-banned!');
        embed.setDescription(
            `${member.user.tag} will be unbanned *${moment(Date.now() + ms(args[1])).fromNow()}*.`
        );
        embed.setThumbnail('https://i.imgur.com/NG469Iv.png');
        embed.setAuthor(msg.author.tag, msg.author.avatarURL()!);
        msg.channel.send(embed);
    });

    let time = admin.firestore.Timestamp.fromMillis(Date.now() + ms(args[1]));

    let docData = {
        guild: msg.guild.id,
        channel: msg.channel.id,
        completed: false,
        desc: '',
        type: 'ban',
        time: time,
    };

    let document = firestore
        .collection('guilds')
        .doc(msg.guild.id)
        .collection('punishments')
        .doc(bannedMember.id);

    document.set(docData);
};

export { run };
