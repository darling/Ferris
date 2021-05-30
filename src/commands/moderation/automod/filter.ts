import { Collection } from 'discord.js';
import { ICommand } from '../../../types/commands';
import { automodAddTag, automodDeleteTag, automodGetTags } from '../../../util/automod';
import { IBannedWord } from '../../../util/db/config';
import { missingParamEmbed } from '../../../util/embedTemplates';
import { messageReply } from '../../../util/interactions/message';
import { automodSubCommands } from './automod';

export const filterSubcommands = new Collection<string, ICommand>();

// TODO: Feed add and remove into a factory for any other filters that use the tag system (see: links)

filterSubcommands.set('add', {
    name: 'add',
    aliases: ['a'],
    arguments: [
        {
            name: 'tag',
            type: '...string',
            required: true,
        },
    ],
    run: (msg, args: { tag: string }, guild) => {
        if (!guild) return;
        automodAddTag(guild.id, 'word_filter', args.tag);
        messageReply(msg.channel, `\`\`\`JSON\n${JSON.stringify({ success: true })}\`\`\``);
    },
    description: 'W',
});

filterSubcommands.set('remove', {
    name: 'remove',
    aliases: ['r', 'd', 'rem', 'del'],
    arguments: [
        {
            name: 'tag',
            type: '...string',
            required: true,
        },
    ],
    run: async (msg, args: { tag: string }, guild) => {
        if (!guild) return;
        const tags = (await automodGetTags(guild.id, 'word_filter')) as IBannedWord[] | undefined;

        const tag = tags?.find((term) => {
            return term.tag === args.tag;
        });

        if (!tag) return messageReply(msg.channel, 'Please enter an existing tag!');

        automodDeleteTag(guild.id, 'word_filter', tag);
        messageReply(msg.channel, `\`\`\`JSON\n${JSON.stringify({ success: true })}\`\`\``);
    },
    description: 'W',
});

automodSubCommands.set('filter', {
    name: 'filter',
    aliases: ['f'],
    arguments: [
        {
            name: 'action',
            type: 'subcommand',
            required: false,
        },
    ],
    run: async (msg, _args, guild) => {
        if (!guild) return;
        const tags = (await automodGetTags(guild.id, 'word_filter')) as IBannedWord[] | undefined;

        console.log(tags);

        let message = '';

        tags?.forEach(({ tag }) => {
            message += `- ${tag}`;
            message += '\n';
        });

        messageReply(msg.channel, `EXISTING BANNED WORDS:\n\`\`\`md\n${message}\`\`\``);
    },
    subcommands: filterSubcommands,
    description: 'W',
});
