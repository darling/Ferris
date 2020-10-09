import { client, FerrisClient } from '../app';
import { Message } from 'discord.js';
import { readdirSync } from 'fs';

interface RunCommand {
    (client: FerrisClient, msg: Message, args: string[]): void;
}

// function requireCommands(dirname: string) {
//     readdirSync(dirname + '/').forEach((file) => {
//         if (!file.endsWith('.js')) return;
//         let commandName = file.split('.')[0].toLowerCase();
//         if (commandName === 'index') return;
//         import(`./commands/${file}`).then((prop) => {
//             client.commands.set(commandName, prop);

//             if (prop.aliases) {
//                 prop.aliases.forEach((alias: string) => {
//                     client.commands.set(alias, prop);
//                 });
//             }
//         });
//         console.log('COMMANDS: ', 'LOADED COMMAND: ', commandName);
//     });
// }

export { RunCommand };
