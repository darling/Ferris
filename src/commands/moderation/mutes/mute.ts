import { GuildMember } from 'discord.js';

import { admin, client, firestore } from '../../../app';
import { PermissionLevels } from '../../../types/commands';
import { missingParamEmbed } from '../../../util/embedTemplates';
import { muteDialog } from '../../../util/muteFunctions';

client.commands.set('mute', {
    name: 'mute',
    guildOnly: true,
    arguments: [
        {
            name: 'user',
            type: 'member',
            required: true,
            missing: (msg) => {
                const embed = missingParamEmbed(
                    'Please mention or put the ID of any member in this Guild.'
                );
                msg.channel.send(embed);
            },
        },
        {
            name: 'time',
            type: 'duration',
            required: true,
            missing: (msg) => {
                const embed = missingParamEmbed(
                    'Please make sure to put a duration. Examples of durations inlcude `2w`, `3h`.'
                );
                msg.channel.send(embed);
            },
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
            desc: args.reason || 'No reason provided',
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
