import { sample } from 'lodash';
import { client } from '../../app';
import { argumentList } from '../arguments';

argumentList.set('subcommand', {
    name: 'subcommand',
    execute: async function (_argument, params, msg, command) {
        const [subcommandName] = params;

        return command.subcommands?.find((sub) => {
            return sub.name === subcommandName || Boolean(sub.aliases?.includes(subcommandName));
        });
    },
    example: () => {
        return sample(client.commands.keyArray()) || 'help';
    },
    description:
        "A sub-command has its own options, requirements, and logic. Ferris doesn't have built in documentation for them but they should be intuitive to use and help you use them as you go. ",
});
