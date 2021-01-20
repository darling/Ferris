import { sample } from 'lodash';
import { client } from '../../app';
import { argumentList } from '../arguments';

argumentList.set('command', {
    name: 'command',
    execute: async function (_argument, params) {
        const [name] = params;
        if (!name) return;

        const commandName = name.toLowerCase();
        const command = client.commands.get(commandName);
        if (command) return command;

        return client.commands.find((cmd) => {
            return Boolean(cmd.aliases?.includes(commandName));
        });
    },
    example: () => {
        return sample(client.commands.keyArray()) || 'help';
    },
});
