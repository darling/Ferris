// import { Message } from 'discord.js';
// import { client } from '../../app';
// import { automodEnabled } from '../automod';
// import { getConfig } from '../db/config';
// import { passiveTests } from '../passiveTest';

// passiveTests.set('link-filter', async (msg: Message) => {
//     const { content, author, channel, guild } = msg;
//     if (!guild) return;

//     const config = await getConfig(guild.id);
//     const automodIsEnabled = await automodEnabled(guild.id);

//     if (!config || !automodIsEnabled) return;

//     const automod = config.automod;

//     if (!automod || !automod.link_filter) return; // null case for compiler

//     // if (!automod.channels?.includes(channel.id)) return; // channel may be whitelisted
//     // if (!automod.roles?.includes(channel.id)) return; // roles may be whitelisted

//     const hits = automod.link_filter.tags?.map((bannedLink) => {
//         const { tag, domainOnly, slug } = bannedLink;

//         return content.includes(tag);
//     });

//     if (hits?.includes(true))
//         return {
//             automated: true,
//             by: client.user?.id || 'BOT',
//             reason: 'User said a banned link.',
//         };

//     return undefined;
// });
