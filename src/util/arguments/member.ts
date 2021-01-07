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
});
