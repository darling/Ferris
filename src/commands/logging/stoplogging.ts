import { client } from '../../app';
import { updateLogChannelProperty } from '../../util/db/config';
import { successEmbed } from '../../util/embedTemplates';
import { messageReply } from '../../util/interactions/message';

client.commands.set('stoplogging', {
    name: 'stoplogging',
    guildOnly: true,
    arguments: [],
    userGuildPerms: ['MANAGE_GUILD'],
    run: (msg, _args: Props, guild) => {
        if (!guild) return;
        updateLogChannelProperty(guild.id, { enabled: false });
        successEmbed(msg.channel, 'Logging disabled', 'Success!');
    },
    iconName: 'log',
    description:
        'This command can be used to **temporarily disable** logging. You can __resume__ logging with the `resumelogging` command. ',
});

interface Props {}
