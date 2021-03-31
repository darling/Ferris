import { Message } from 'discord.js';
import { client } from '../../app';
import { automodEnabled } from '../automod';
import { getConfig } from '../db/config';
import { passiveTests } from '../passiveTest';

passiveTests.set('word-filter', async (msg: Message) => {
    const { content, author, channel, guild } = msg;
    if (!guild) return; // null case for compler

    const config = await getConfig(guild.id);
    const automodIsEnabled = await automodEnabled(guild.id);

    if (!config || !automodIsEnabled) return;

    const automod = config.automod;

    if (!automod || !automod.word_filter) return; // null case for compiler

    // if (!automod.channels?.includes(channel.id)) return; // channel may be whitelisted
    // if (!automod.roles?.includes(channel.id)) return; // roles may be whitelisted

    const hits = automod.word_filter.tags?.map((bannedWord) => {
        const { strict, tag, case_sensitive } = bannedWord;

        const casedTag = case_sensitive ? tag : tag.toLowerCase();
        const casedContent = case_sensitive ? content : content.toLowerCase();

        // Strict means strictly checking for the tag.
        if (strict) {
            return casedContent.split(/ +/g).includes(casedTag.trim());
        } else {
            return casedContent.includes(casedTag);
        }
    });

    if (hits?.includes(true))
        return {
            automated: true,
            by: client.user?.id || 'BOT',
            reason: 'User said a banned word.',
        };

    return undefined;
});
