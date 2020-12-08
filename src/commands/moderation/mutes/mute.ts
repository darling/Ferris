import { GuildMember } from 'discord.js';

import { admin, client, firestore } from '../../../app';
import { PermissionLevels } from '../../../types/commands';
import { getConfig } from '../../../util/db/config';
import { getPrefix } from '../../../util/db/prefix';
import { getErrorEmbed, missingParamEmbed } from '../../../util/embedTemplates';
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
    botGuildPerms: ['MANAGE_ROLES'],
    run: (msg, args: PunishArgs, guild) => {
        if (!guild || !args.user.manageable) return;

        const muteRole = getConfig(guild.id)?.muted_role;
        if (!muteRole) {
            const embed = getErrorEmbed();

            embed.setTitle('Uh oh!')
            embed.setDescription('Please make sure to set your mute role by doing `' + getPrefix(guild.id) + 'muterole @role`. That way Ferris knows which role should be assigned on mute!');

            msg.channel.send(embed);
            return;
        };

        args.user.roles.add([muteRole]).then((mutedMember) => {
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
            timeGiven: timeGiven,
            author: msg.author.id,
            time: time,
        };

        let document = firestore
            .collection('guilds')
            .doc(guild.id)
            .collection('punishments')
            .doc(args.user.id);

        document.set(docData);
    },
});

interface PunishArgs {
    user: GuildMember;
    time: number;
    reason?: string;
}
