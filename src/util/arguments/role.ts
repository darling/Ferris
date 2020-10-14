import { argumentList } from '../arguments';

argumentList.set('role', {
    name: 'role',
    execute: async function (_argument, params, msg) {
        const [id] = params;
        if (!id) return;

        const guild = msg.guild;
        if (!guild) return;

        const roleId = id.startsWith('<@&') ? id.substring(3, id.length - 1) : id;

        const name = id.toLowerCase();
        const role =
            guild.roles.cache.get(roleId) ||
            guild.roles.cache.find((role) => {
                return role.name.toLowerCase() === name;
            });

        if (role) return role;
    },
});
