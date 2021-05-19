import { GuildMember } from 'discord.js';

import { client, firestore } from '../../../app';
import { getConfig } from '../../../util/db/config';
import { getPrefix } from '../../../util/db/prefix';
import { errorEmbed, missingParamEmbed } from '../../../util/embedTemplates';

client.commands.set('unmute', {
    name: 'unmute',
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

        if (args.user.roles.cache.has(muteRole)) {
            const doc = firestore
                .collection('guilds')
                .doc(guild.id)
                .collection('punishments')
                .doc(args.user.id);

            doc.delete();
        }
    },
    iconName: 'mute',
});

interface PunishArgs {
    user: GuildMember;
}
