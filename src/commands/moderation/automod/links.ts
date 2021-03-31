// import { Collection } from 'discord.js';
// import { ICommand } from '../../../types/commands';
// import { missingParamEmbed } from '../../../util/embedTemplates';
// import { automodSubCommands } from './automod';

// export const linksSubcommands = new Collection<string, ICommand>();

// linksSubcommands.set('add', {
//     name: 'add',
//     aliases: ['a'],
//     arguments: [
//         {
//             name: 'domain',
//             type: '...string',
//             required: true,
//         },
//     ],
//     run: (msg, args: { domain: string }, guild) => {
//         msg.reply(`\`\`\`JSON\n${JSON.stringify({ args })}\`\`\``);
//     },
// });

// linksSubcommands.set('remove', {
//     name: 'remove',
//     aliases: ['r', 'd', 'rem', 'del'],
//     arguments: [
//         {
//             name: 'domain',
//             type: '...string',
//             required: true,
//         },
//     ],
//     run: (msg, args: { domain: string }, guild) => {
//         msg.reply(`\`\`\`JSON\n${JSON.stringify({ args })}\`\`\``);
//     },
// });

// automodSubCommands.set('links', {
//     name: 'links',
//     aliases: ['l'],
//     arguments: [
//         {
//             name: 'test',
//             type: 'subcommand',
//             required: false,
//         },
//     ],
//     run: (msg, _args, guild) => {
//         msg.reply(`\`\`\`JSON\n${JSON.stringify({ ok: true })}\`\`\``);
//     },
//     subcommands: linksSubcommands,
// });
