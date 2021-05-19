import { client } from '../../app';
import { updateLogChannelProperty } from '../../util/db/config';

client.commands.set('stoplogging', {
    name: 'stoplogging',
    guildOnly: true,
    arguments: [],
    userGuildPerms: ['MANAGE_GUILD'],
    run: (_msg, _args: Props, guild) => {
        if (!guild) return;
        updateLogChannelProperty(guild.id, { enabled: false });
    },
    iconName: 'log',
});

interface Props {}
