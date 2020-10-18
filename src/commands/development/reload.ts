import { client } from '../../app';

client.commands.set('reload', {
    name: 'reload',
    arguments: [
        {
            name: 'command',
            type: 'string',
        },
    ],
    run: (msg, args, guild) => {
        delete require.cache[require.resolve('../')];
    },
});
