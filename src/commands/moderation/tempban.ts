import { Message, GuildMember, MessageEmbed, Guild, Collection } from 'discord.js';
import { FerrisClient, admin } from '../../app';

import moment from 'moment';

import { RunCommand } from '../../util/commandinterface';
import ms from 'ms';
import { INewPunishmentData, newPunishment } from '../../util/punishment';

const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
    const member: GuildMember | null = msg.member;
    if (member === null) {
        return;
    }

    const guild: Guild | null = msg.guild;
    if (guild === null) {
        return;
    }

    const guildClient: GuildMember | null = guild.me;
    if (guildClient === null) {
        msg.reply('am I even in this server?');
        return;
    }

    if (!member.hasPermission('BAN_MEMBERS')) {
        msg.reply('You do not have permission to ban members.');
        return;
    }

    if (!guildClient.hasPermission('BAN_MEMBERS')) {
        msg.reply('I do not have permission to ban members.');
        return;
    }

    const mentions: Collection<string, GuildMember> | null = msg.mentions.members;
    if (mentions === null) {
        msg.reply('please mention a user to ban.');
        return;
    }

    let bannedMember: GuildMember | undefined = mentions.first();
    if (!bannedMember) return;

    if (!bannedMember.bannable) {
        msg.reply('I can not ban this member.');
        return;
    }

    let hasProperDateTime = /^\d{1,3}[sdmwh]{1}$/.test(args[1]);
    if (!hasProperDateTime) return;

    bannedMember.ban({ days: 3, reason: args.join(' ') }).then((member) => {
        const embed = new MessageEmbed();
        embed.setColor(16646143);
        embed.setTitle(member.user.username + ' has been temp-banned!');
        embed.setDescription(
            `${member.user.tag} will be unbanned *${moment(Date.now() + ms(args[1])).fromNow()}*.`
        );
        embed.setThumbnail('https://i.imgur.com/NG469Iv.png');
        embed.setAuthor(msg.author.tag, msg.author.avatarURL()!);
        msg.channel.send(embed);
    });

    const docData: INewPunishmentData = {
        member: bannedMember.id,
        guild: guild.id,
        channel: msg.channel.id,
        type: 'ban',
        roles: bannedMember.roles.cache.array().map((role) => role.id),
        author: msg.author.id,
        time: admin.firestore.Timestamp.fromMillis(Date.now() + ms(args[1])),
    };

    newPunishment(docData);
};

const aliases = ['tb', 'tban'];

export { run };
