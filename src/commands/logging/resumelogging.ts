import { client } from '../../app';
import { updateLogChannelProperty } from '../../util/db/config';
import { successEmbed } from '../../util/embedTemplates';

client.commands.set('resumelogging', {
    name: 'resumelogging',
    guildOnly: true,
    arguments: [],
    userGuildPerms: ['MANAGE_GUILD'],
    run: (msg, _args: Props, guild) => {
        if (!guild) return;
        updateLogChannelProperty(guild.id, { enabled: true });
        successEmbed(msg.channel, 'Logging enabled', 'Success!');
    },
    iconName: 'log',
    description:
        'This command can be used to **continue** logging after using the `stoplogging` command. This allows the bot to __continue keeping track__ of logs in your server. ',
});

interface Props {}
