import { sample } from 'lodash';
import { client } from '../../app';
import { argumentList } from '../arguments';

argumentList.set('textchannel', {
    name: 'textchannel',
    execute: async function (_argument, params, msg, command) {
        const [subcommandName] = params;

        return command.subcommands?.find((sub) => {
            return sub.name === subcommandName || Boolean(sub.aliases?.includes(subcommandName));
        });
    },
    example: () => {
        return sample(client.commands.keyArray()) || 'help';
    },
});
