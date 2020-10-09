import { Message, GuildMember, Guild, TextChannel } from 'discord.js';
import { FerrisClient, firestore, admin } from '../../app';

import { RunCommand } from '../../util/commandinterface';
import { isUserMention, parseIfTime, stripMention } from '../../util/parse';
import { muteDialog } from '../../util/muteFunctions';
import { sendSimpleEmbed } from '../../util/embed';

const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
    const guild: Guild | null = msg.guild;
    if (guild === null) {
        return;
    }

    const muteRole = guild.roles.cache.find((role) => role.name === 'muted');
    if (muteRole === undefined) {
        msg.reply("This server doesn't have a `muted` role");
        return;
    }

    const member: GuildMember | null = msg.member;
    if (member === null) {
        return;
    }

    // TODO: Make utility for parsing members
    if (args.length < 1 || !isUserMention(args[0])) {
        sendSimpleEmbed('Please mention a valid user', msg.channel as TextChannel);
        return;
    }

    if (!member.hasPermission('MANAGE_ROLES')) {
        msg.reply('you do not have permission to mute members.');
        return;
    }

    if (!guild.me!.hasPermission('MANAGE_ROLES')) {
        msg.reply('I do not have permission to mute members.');
        return;
    }

    let mutedMember: GuildMember | undefined = guild.members.cache.get(stripMention(args[0]));
    if (mutedMember === undefined) {
        return;
    }

    const timeSpecified = parseIfTime(args[1]);
    if (timeSpecified === undefined) {
        msg.reply('Please specify a correct time.');
        return;
    }

    let currentRoles = mutedMember.roles.cache
        .array()
        .map((role) => role.id)
        .toString();

    mutedMember.roles.set([muteRole]).then((mutedMember) => {
        muteDialog(mutedMember, timeSpecified, msg);
    });

    let time = admin.firestore.Timestamp.fromMillis(Date.now() + timeSpecified);
    let timeGiven = admin.firestore.Timestamp.now();

    let docData = {
        guild: guild.id,
        channel: msg.channel.id,
        completed: false,
        desc: '',
        type: 'mute',
        roles: currentRoles,
        timeGiven: timeGiven,
        author: msg.author.id,
        time: time,
    };

    let document = firestore
        .collection('guilds')
        .doc(guild.id)
        .collection('punishments')
        .doc(mutedMember.id);

    document.set(docData);
};

export { run };
