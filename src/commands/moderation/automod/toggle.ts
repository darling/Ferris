import { automodToggle } from '../../../util/automod';
import { messageReply } from '../../../util/interactions/message';
import { automodSubCommands } from './automod';

automodSubCommands.set('enable', {
    name: 'enable',
    aliases: ['on'],
    run: (msg, _args, guild) => {
        if (!guild) return;
        automodToggle(guild.id, true);
        messageReply(msg.channel, 'Automod has been enabled.');
    },
    description: 'W',
});

automodSubCommands.set('disable', {
    name: 'disable',
    aliases: ['off'],
    run: (msg, _args, guild) => {
        if (!guild) return;
        automodToggle(guild.id, false);
        messageReply(msg.channel, 'Automod has been disabled.');
    },
    description: 'W',
});
