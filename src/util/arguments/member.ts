import { argumentList } from '../arguments';

argumentList.set('member', {
    name: 'member',
    execute: async function (_argument, params, message) {
        const [id] = params;
        if (!id) return;

        const guild = message.guild;
        if (!guild) return;

        const startingPrefix = id.startsWith('<@');

        const userId = startingPrefix ? id.substring(startingPrefix ? 3 : 2, id.length - 1) : id;

        const member = await guild.members.fetch(userId);
        if (member) return member;
    },
});
