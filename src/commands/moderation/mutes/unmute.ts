import { GuildMember, MessageEmbed } from 'discord.js';

import { admin, client, firestore } from '../../../app';
import { PermissionLevels } from '../../../types/commands';
import { getConfig } from '../../../util/db/config';
import { getPrefix } from '../../../util/db/prefix';
import { EmbedColors } from '../../../util/embed';
import { getErrorEmbed, missingParamEmbed } from '../../../util/embedTemplates';
import { muteDialog } from '../../../util/muteFunctions';
import { newLog } from '../../../util/webhookLogging';

client.commands.set('unmute', {
    name: 'unmute',
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
        }
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

        if (args.user.roles.cache.has(muteRole)) {
            const doc = firestore.collection('guilds').doc(guild.id).collection('punishments').doc(args.user.id)

            doc.delete();
        }
    },
});

interface PunishArgs {
    user: GuildMember;
}
