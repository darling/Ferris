import { Role } from 'discord.js';
import { compact, sample } from 'lodash';
import { argumentList } from '../arguments';

argumentList.set('...roles', {
    name: '...roles',
    execute: async function (_argument, params, msg) {
        if (params.length <= 0) return;

        const guild = msg.guild;
        if (!guild) return;

        return compact(
            params.map((id) => {
                const roleId = id.startsWith('<@&') ? id.substring(3, id.length - 1) : id;

                const name = id.toLowerCase();
                const role =
                    guild.roles.cache.get(roleId) ||
                    guild.roles.cache.find((role) => {
                        return role.name.toLowerCase() === name;
                    });

                if (role) return role;
            })
        );
    },
    description:
        'This is a long list of roles. Add as much as you want and Ferris will record it all.',
});
