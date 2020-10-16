import { Message, GuildMember, Guild, TextChannel } from 'discord.js';
import { FerrisClient, firestore, admin } from '../../app';

import { isUserMention, parseIfTime, stripMention } from '../../util/parse';
import { muteDialog } from '../../util/muteFunctions';
import { sendSimpleEmbed } from '../../util/embed';

import { IDatabaseSchema } from '../../util/databaseFunctions';
import { serverConfigs } from '../../util/serverInfo';

import { client } from '../../app';

client.commands.set('warn', {
    name: 'warn',
    guildOnly: true,
    arguments: [
        {
            name: 'user',
            type: 'member',
            required: true,
        },
        {
            name: 'time',
            type: 'duration',
            required: true,
        },
        {
            name: 'reason',
            type: '...string',
            required: false,
        },
    ],
    run: (msg, args: PunishArgs, guild) => {
        if (!guild) return;

        const muteRole = guild.roles.cache.find((role) => role.name === 'muted');
        if (!muteRole) return;

        let currentRoles = args.user.roles.cache
            .array()
            .map((role) => role.id)
            .toString();

        args.user.roles.set([muteRole]).then((mutedMember) => {
            muteDialog(mutedMember, args.time, msg);
        });

        let time = admin.firestore.Timestamp.fromMillis(Date.now() + args.time);
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
            .doc(args.user.id);

        msg.channel.send(`\`\`\`json\n${JSON.stringify(docData, null, 2)}\`\`\``);
        document.set(docData);
    },
});

interface PunishArgs {
    user: GuildMember;
    time: number;
    reason?: string;
}

// const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
//     const guild: Guild | null = msg.guild;
//     if (guild === null) {
//         return;
//     }

//     const muteRole = guild.roles.cache.find((role) => role.name === 'muted');
//     if (muteRole === undefined) {
//         msg.reply("This server doesn't have a `muted` role");
//         return;
//     }

//     const member: GuildMember | null = msg.member;
//     if (member === null) {
//         return;
//     }

//     // TODO: Make utility for parsing members
//     if (args.length < 1 || !isUserMention(args[0])) {
//         console.log(args);
//         sendSimpleEmbed('Please mention a valid user', msg.channel as TextChannel);
//         return;
//     }

//     if (!member.hasPermission('MANAGE_ROLES')) {
//         msg.reply('you do not have permission to mute members.');
//         return;
//     }

//     if (!guild.me!.hasPermission('MANAGE_ROLES')) {
//         msg.reply('I do not have permission to mute members.');
//         return;
//     }

//     let mutedMember: GuildMember | undefined = guild.members.cache.get(stripMention(args[0]));
//     if (mutedMember === undefined) {
//         return;
//     }

//     const timeSpecified = parseIfTime(args[1]);
//     if (timeSpecified === undefined) {
//         msg.reply('Please specify a correct time.');
//         return;
//     }

//     let currentRoles = mutedMember.roles.cache
//         .array()
//         .map((role) => role.id)
//         .toString();

//     let time = admin.firestore.Timestamp.fromMillis(Date.now() + timeSpecified);
//     let timeGiven = admin.firestore.Timestamp.now();

//     let docData = {
//         guild: guild.id,
//         channel: msg.channel.id,
//         completed: false,
//         desc: '',
//         type: 'mute',
//         roles: currentRoles,
//         timeGiven: timeGiven,
//         author: msg.author.id,
//         time: time,
//     };

//     let document = firestore
//         .collection('guilds')
//         .doc(guild.id)
//         .collection('punishments')
//         .doc(mutedMember.id);

//     document.set(docData);
// };
