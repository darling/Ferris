import { client } from '../../app';
import { updateLogChannelProperty } from '../../util/db/config';

client.commands.set('stoplogging', {
    name: 'stoplogging',
    guildOnly: true,
    arguments: [],
    userGuildPerms: ['MANAGE_GUILD'],
    run: (msg, args: Props, guild) => {
        if (!guild) return;
        updateLogChannelProperty(guild.id, { enabled: false });
    },
});

interface Props {}
