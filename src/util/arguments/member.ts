import { random, sample } from 'lodash';
import { argumentList } from '../arguments';

argumentList.set('member', {
    name: 'member',
    execute: async function (_argument, params, message) {
        const [id] = params;
        if (!id) return;

        const guild = message.guild;
        if (!guild) return;

        const userId = id.replace(/<@(!)?/g, '').replace('>', '');

        const member = await guild.members.fetch(userId);
        if (member) return member;
    },
    example: () => {
        const userId =
            sample([
                '141075183271280641',
                '556577211784757253',
                '739581088413909012',
                '637804742935838751',
            ]) || '141075183271280641';
        const isMention = !!random(1, false);
        return isMention ? `<@${userId}>` : userId;
    },
    description:
        'A member is someone who is in your guild. You can mention them (ping) or type their ID.',
});
