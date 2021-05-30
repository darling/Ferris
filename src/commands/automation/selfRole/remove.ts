import { Role } from 'discord.js';
import { client } from '../../../app';
import { getConfig } from '../../../util/db/config';
import { errorEmbed } from '../../../util/embedTemplates';
import { messageReply } from '../../../util/interactions/message';

client.commands.set('remove', {
    name: 'remove',
    aliases: ['rem', 'r'],
    arguments: [{ name: 'role', type: 'role' }],
    guildOnly: true,
    iconName: 'role',
    botGuildPerms: ['MANAGE_ROLES'],
    description: 'Remove yourselves of any roles that are on the self-role list.',
    run: async (msg, args: { role: Role }, guild) => {
        if (!guild || !guild.me) return;

        const config = await getConfig(guild.id);

        if (args.role.managed || args.role.comparePositionTo(guild.me.roles.highest) > 0) {
            errorEmbed(msg.channel, 'I can not manage this role.');
            return;
        }

        if (config?.selfrole?.includes(args.role.id)) {
            await msg.member?.roles.remove(args.role.id);
            await msg.react('769345876984332288');
        } else {
            await msg.react('769345886702141470');
            // messageReply(msg.channel, 'No');
        }
    },
});
