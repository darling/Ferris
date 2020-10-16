import { Channel, Message, TextChannel } from 'discord.js';
import { FerrisClient } from '../../app';

// const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
//     const amtOfMessages: number = +args[0];
//     if (amtOfMessages < 1 || isNaN(amtOfMessages)) return;

//     let channel: TextChannel = msg.channel as TextChannel;

//     if (msg.mentions.users.size !== 0) {
//         const messages = channel.messages.cache
//             .filter((currentMsg) => {
//                 return currentMsg.author.id === msg.mentions.users.first()?.id;
//             })
//             .array()
//             .reverse()
//             .slice(0, amtOfMessages);
//         channel.bulkDelete(messages);
//         return;
//     } else if (msg.mentions.channels.size !== 0) {
//         msg.mentions.channels.forEach((channel, id) => {
//             channel
//                 .bulkDelete(amtOfMessages)
//                 .then(() => {
//                     channel.send('Deleted msges from channel');
//                 })
//                 .catch((error) => console.error(error));
//         });
//         return;
//     } // TODO: Write clause for deleting all msges by specified role

//     channel
//         .bulkDelete(amtOfMessages)
//         .then(() => {
//             msg.channel.send(amtOfMessages + ' msges deleted.');
//         })
//         .catch((e) => {
//             console.error(e);
//         });
// };
