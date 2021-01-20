import { sample, random } from 'lodash';
import { argumentList } from '../arguments';

argumentList.set('textchannel', {
    name: 'textchannel',
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

        if (channel?.type !== 'text') return;

        return channel;
    },
    example: () => {
        const userId =
            sample(['761495785778446366', '789642891290476574', '762047707861876746']) ||
            '761495785778446366';
        const isMention = !!random(1, false);
        return isMention ? `<#${userId}>` : userId;
    },
});
