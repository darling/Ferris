import { client } from '../../app';

client.commands.set('stoplogging', {
    name: 'stoplogging',
    guildOnly: true,
    arguments: [],
    run: (msg, args, guild) => {
        if (!guild) return;
    },
});
