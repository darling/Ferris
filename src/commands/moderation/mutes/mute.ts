import { Message, GuildMember, Guild, TextChannel } from 'discord.js';
import { FerrisClient, firestore, admin } from '../../../app';

import { isUserMention, parseIfTime, stripMention } from '../../../util/parse';
import { muteDialog } from '../../../util/muteFunctions';
import { sendSimpleEmbed } from '../../../util/embed';

import { IDatabaseSchema } from '../../../util/databaseFunctions';
import { serverConfigs } from '../../../util/serverInfo';

import { client } from '../../../app';
import { PermissionLevels } from '../../../types/commands';

client.commands.set('mute', {
    name: 'mute',
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
    userGuildPerms: ['MANAGE_ROLES'],
    permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
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
