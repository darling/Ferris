import { random, sample } from 'lodash';
import { argumentList } from '../arguments';

argumentList.set('newschannel', {
    name: 'newschannel',
    execute: async function (_argument, params, msg) {
        const [id] = params;
        if (!id) return;

        const guild = msg.guild;
        if (!guild) return;

        const channelIdentifier = id.startsWith('<#')
            ? id.substring(2, id.length - 1)
            : id.toLowerCase();

        const channel =
            guild.channels.cache.get(channelIdentifier) ||
            guild.channels.cache.find((channel) => {
                return channel.name === channelIdentifier;
            });

        if (channel?.type !== 'voice') return;

        return channel;
    },
    example: () => {
        const userId =
            sample(['768594233383976970', '789642891290476574', '762047707861876746']) ||
            '768594233383976970';
        const isMention = !!random(1, false);
        return isMention ? `<#${userId}>` : userId;
    },
    description:
        'You cannot mention a voice channel while using Discord. But if you use its ID, Ferris will accept it.',
});
