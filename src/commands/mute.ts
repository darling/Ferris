import { Message, GuildMember, Guild } from 'discord.js';
import { FerrisClient, firestore, admin } from '../app';

import { RunCommand } from './util/commandinterface';
import { parseIfTime } from './util/parse';
import { muteDialog } from '../util/muteFunctions';

const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
    const muteRole = msg.guild?.roles.cache.find((role) => role.name === 'muted');
    if (muteRole === undefined) {
        msg.reply("This server doesn't have a `muted` role");
        return;
    }

    const member: GuildMember | null = msg.member;
    if(member === null) {
        return;
    }

    const guild: Guild | null = msg.guild;
    if(guild === null) {
        return;
    }

    if (!msg.mentions.members) {
        msg.reply('please mention a user to mute.');
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

    let mutedMember: GuildMember | undefined = msg.mentions.members.first();
    if (mutedMember === undefined) {
        return;
    }

    const timeSpecified = parseIfTime(args[1]);
    if (timeSpecified === undefined) {
        msg.reply('Please specify a correct time.')
        return;
    }

    let currentRoles = mutedMember.roles.cache
        .array()
        .map((role) => role.id)
        .toString();

    mutedMember.roles.set([muteRole]);

    muteDialog(mutedMember, timeSpecified, msg);

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
