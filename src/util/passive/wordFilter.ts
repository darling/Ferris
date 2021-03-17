import { Message } from 'discord.js';
import { client } from '../../app';
import { IInfraction } from '../../types/infraction';
import { getConfig } from '../db/config';
import { passiveTests } from '../passiveTest';

passiveTests.set('Word Filter', async (msg: Message) => {
    const { content, author, channel, guild } = msg;
    if (!guild) return undefined;

    const config = await getConfig(guild.id);
    if (!config || !config.automod?.word_filter) return undefined; // Checks for if the word filter, let alone the config even exists
    if (!config.automod.enabled || !(config.automod.word_filter.enabled === true)) return undefined; // enabled
    if (!config.automod.channels?.includes(channel.id)) return undefined; // channel may be whitelisted
    if (!config.automod.roles?.includes(channel.id)) return undefined; // roles may be whitelisted

    const hits = config.automod.word_filter.banned_words?.map((bannedWord) => {
        const { strict, tag, case_sensitive } = bannedWord;

        const casedTag = case_sensitive ? tag : tag.toLowerCase();
        const casedContent = case_sensitive ? content : content.toLowerCase();

        // Strict means strictly checking for the tag.
        if (strict) {
            return casedContent.includes(casedTag);
        } else {
            return casedContent.split(/ +/g).includes(casedTag.trim());
        }
    });

    if (hits?.includes(true))
        return {
            date: Date.now(),
            user: author.id,
            automated: true,
            by: client.user?.id,
            reason: 'User said a banned word.',
        };

    return undefined;
});
