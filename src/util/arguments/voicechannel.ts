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
});