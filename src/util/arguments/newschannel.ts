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

        if (channel?.type !== 'news') return;

        return channel;
    },
    example: () => {
        const userId =
            sample(['601618014252826626', '761480573490561034', '787928385925545995']) ||
            '601618014252826626';
        const isMention = !!random(1, false);
        return isMention ? `<#${userId}>` : userId;
    },
    description:
        'Unlike a normal text channel, Announcement channels will come with a “Follow” button. This will allow members of the server to hook it up to their own personal servers. Ferris can watch these as well by using either the ID or mention of the channel.',
});
