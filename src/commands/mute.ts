import { Message, GuildMember, MessageEmbed } from 'discord.js';
import { FerrisClient, firestore, admin } from '../app';

import moment from 'moment';

import { RunCommand } from './util/commandinterface';
import ms from 'ms';

const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
    const role = msg.guild?.roles.cache.find((role) => role.name === 'muted');

    if (role === undefined) {
        msg.reply("This server doesn't have a `muted` role");
        return;
    }

    if (!msg.mentions.members) {
        msg.reply('please mention a user to mute.');
        return;
    }

    if (!msg.member?.hasPermission('MUTE_MEMBERS')) {
        msg.reply('You do not have permission to mute members.');
        return;
    }

    if (!msg.guild?.me!.hasPermission('MUTE_MEMBERS')) {
        msg.reply('You do not have permission to mute members.');
        return;
    }

    let mutedMember: GuildMember | undefined = msg.mentions.members.first();

    let hasProperDateTime = /^\d{1,3}[sdmwh]{1}$/.test(args[1]);

    if (!hasProperDateTime) return;

    // mutedMember?.roles.add(role);
    let currentRoles = mutedMember?.roles.cache
        .array()
        .map((role) => role.id)
        .toString();

    mutedMember?.roles.set([role]);

    let embed = new MessageEmbed();
    embed.setColor(16646143);
    embed.setTitle(mutedMember!.user.username + ' has been muted!');
    embed.setDescription(
        `${mutedMember!.user.tag} will be unmuted *${moment(Date.now() + ms(args[1])).fromNow()}*.`
    );
    embed.setThumbnail('https://i.imgur.com/NG469Iv.png');
    embed.setAuthor(msg.author.tag, msg.author.avatarURL()!);
    msg.channel.send(embed);

    let time = admin.firestore.Timestamp.fromMillis(Date.now() + ms(args[1]));
    let timeGiven = admin.firestore.Timestamp.fromMillis(Date.now());

    let docData = {
        guild: msg.guild.id,
        channel: msg.channel.id,
        completed: false,
        desc: '',
        type: 'mute',
        roles: currentRoles,
        timeGiven: timeGiven,
        time: time,
    };

    let document = firestore
        .collection('guilds')
        .doc(msg.guild.id)
        .collection('punishments')
        .doc(mutedMember!.id);

    document.set(docData);
};

export { run };
