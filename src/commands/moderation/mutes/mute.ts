import { GuildMember, MessageEmbed } from 'discord.js';

import { admin, client, firestore } from '../../../app';
import { PermissionLevels } from '../../../types/commands';
import { getConfig } from '../../../util/db/config';
import { getPrefix } from '../../../util/db/prefix';
import { EmbedColors } from '../../../util/embed';
import { errorEmbed, missingParamEmbed } from '../../../util/embedTemplates';
import { muteDialog } from '../../../util/muteFunctions';
import { newLog } from '../../../util/webhookLogging';

client.commands.set('mute', {
    name: 'mute',
    guildOnly: true,
    arguments: [
        {
            name: 'user',
            type: 'member',
            required: true,
            missing: (msg) => {
                missingParamEmbed(
                    msg.channel,
                    'Please mention or put the ID of any member in this Guild.'
                );
            },
        },
        {
            name: 'time',
            type: 'duration',
            required: true,
            missing: (msg) => {
                missingParamEmbed(
                    msg.channel,
                    'Please make sure to put a duration. Examples of durations inlcude `2w`, `3h`.'
                );
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
    run: async (msg, args: PunishArgs, guild) => {
        if (!guild || !args.user.manageable) return;

        const muteRole = (await getConfig(guild.id))?.muted_role;
        if (!muteRole) {
            errorEmbed(
                msg.channel,
                'Please make sure to set your mute role by doing `' +
                    (await getPrefix(guild.id)) +
                    'muterole @role`. That way Ferris knows which role should be assigned on mute!'
            );
            return;
        }

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

        document.set(docData).then(() => {
            const embed = new MessageEmbed();

            embed.setTitle('Mute Added');
            embed.setDescription(`<@${args.user.id}> has been muted.`);
            embed.setFooter('ID: ' + args.user.id);
            embed.setColor(EmbedColors.RED);
            embed.setTimestamp();

            newLog('MUTE_ADDED', guild.id, embed);
        });
    },
});

interface PunishArgs {
    user: GuildMember;
    time: number;
    reason?: string;
}
