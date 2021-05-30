import { RouteShorthandOptions } from 'fastify';

import { client } from '../app';
import { server } from '../server';
import { getConfig } from '../util/db/config';
import { errorEmbed, successEmbed } from '../util/embedTemplates';

interface Params {
    id?: string;
}

interface Body {
    guild_id: string;
    role_id: string;
    user_id: string;
}

const postRes: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                    },
                },
            },
            400: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                    },
                },
            },
        },
        body: {
            type: 'object',
            required: ['guild_id', 'role_id', 'user_id'],
            properties: {
                guild_id: {
                    type: 'string',
                },
                role_id: {
                    type: 'string',
                },
                user_id: {
                    type: 'string',
                },
            },
        },
    },
};

server.post<{ Params: Params; Body: Body }>('/role', postRes, async (req, res) => {
    const id = req.body.user_id;

    const guild = await client.guilds.fetch(req.body.guild_id);

    if (!guild || !guild.me) return res.code(400).send({ message: 'Yikes!' });

    const user = await client.users.fetch(id);

    const dmChannel = await user.createDM();

    if (id) {
        const role = await guild.roles.fetch(req.body.role_id);
        const member = await guild.members.fetch({ user: user.id, cache: false });

        if (!role) return res.code(400).send({ message: 'Yikes!' });

        const config = await getConfig(guild.id);

        if (role.managed || role.comparePositionTo(guild.me.roles.highest) > 0) {
            return res.code(400).send({ message: 'Yikes!' });
        }

        if (config?.selfrole?.includes(role.id)) {
            const hasRoleAlready = member.roles.cache.has(role.id);

            if (hasRoleAlready) {
                await member.roles.remove(role.id);
            } else {
                await member.roles.add(role.id);
            }

            successEmbed(
                dmChannel,
                `**${role.name}** in **${guild.name}** has been ${
                    hasRoleAlready ? 'removed' : 'added'
                }.`,
                `Role ${hasRoleAlready ? 'Removed' : 'Added'}!`
            );
        } else {
            errorEmbed(
                dmChannel,
                `${role.name} in ${guild.name} has not been added. Are you allowed to access this role?`,
                'Error!'
            );
        }

        return res.code(200).send({ message: 'Success!' });
    } else {
        return res.code(400).send({ message: 'Yikes!' });
    }
});
