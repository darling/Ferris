import { TextChannel } from "discord.js";
import { toInteger } from "lodash";
import { client } from "../../app";
import { PermissionLevels } from "../../types/commands";
import { missingParamEmbed } from "../../util/embedTemplates";

client.commands.set("purge", {
  name: "purge",
  aliases: ["p", "prune"],
  userGuildPerms: ["MANAGE_MESSAGES"],
  botGuildPerms: ["MANAGE_MESSAGES"],
  arguments: [
    {
      name: "amtOfMessages",
      type: "number",
      required: true,
      missing: (msg) => {
        missingParamEmbed(
          msg.channel,
          "Please make sure to include the number of messages you would like to delete."
        );
      },
    },
  ],
  guildOnly: true,
  run: (msg, args: PurgeArgs, guild) => {
    const channel = msg.channel as TextChannel;

    channel.messages
      .fetch({
        limit: toInteger(args.amtOfMessages > 100 ? 100 : args.amtOfMessages),
      })
      .then((msgs) => channel.bulkDelete(msgs))
      .then((msgs) =>
        channel.send(
          `Successfully deleted ${msgs.size} message(s)`)
        
      ).then(msg => {
    msg.delete({ timeout: 10000 })
  })
      .catch(() =>
        channel.send(
          "Messages older than 14 days cannot be deleted"
        )
      );
  },
  description:
    "This command allows you to **mass delete messages** in your server. This is great for __removing spam and unwanted messages.__",
});

interface PurgeArgs {
  amtOfMessages: number;
}

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


interface PurgeArgs {
    amtOfMessages: number;
}

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
