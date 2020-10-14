import { argumentList } from '../arguments';

argumentList.set('member', {
    name: 'member',
    execute: async function (_argument, params, message) {
        const [id] = params;
        if (!id) return;

        const guild = message.guild;
        if (!guild) return;

        const userId = id.startsWith('<@')
            ? id.substring(id.startsWith('<@!') ? 3 : 2, id.length - 1)
            : id;
        const member = guild.members.cache.get(userId);
        if (member) return member;
    },
});
