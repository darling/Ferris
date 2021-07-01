import { Role } from 'discord.js';
import { RouteShorthandOptions } from 'fastify';
import { compact, difference, intersection, pullAll, remove } from 'lodash';

import { client } from '../app';
import { server } from '../server';
import { successEmbed } from '../util/embedTemplates';

interface Params {
    id?: string;
}

interface Body {
    guild_id: string;
    role_id: string[];
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
                    type: 'array',
                    items: {
                        type: 'string',
                    },
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

    const immutable: Role[] = [];

    if (id) {
        const member = await guild.members.fetch({ user: user.id, force: true });

        const allowedRoles = compact(
            req.body.role_id.map((roleId) => {
                const role = guild.roles.cache.get(roleId);

                if (
                    !(
                        !role ||
                        !guild.me ||
                        role.managed ||
                        role.comparePositionTo(guild.me.roles.highest) > 0
                    )
                ) {
                    return role;
                } else {
                    if (role) immutable.push(role);
                }
            })
        );

        const allowedIds = allowedRoles.map((r) => r.id); // So we can look up the roles later

        const membersRoles = remove(member.roles.cache.array(), (role) => role.id !== guild.id).map(
            (r) => r.id
        ); // dumb
        const existingRoles = intersection(membersRoles, allowedIds);
        const rolesToChange = difference(allowedIds, existingRoles);

        // console.log(member.roles.cache.map((r) => r.id));
        // console.log([...pullAll(membersRoles, existingRoles), ...rolesToChange]);

        await member.roles.set([...pullAll(membersRoles, existingRoles), ...rolesToChange]);

        // if (existingRoles.length > 0) await member.roles.remove(existingRoles);
        // if (rolesToChange.length > 0) await member.roles.add(rolesToChange);

        successEmbed(
            dmChannel,
            `${existingRoles.length < 1 ? '' : 'Removed:\n'}${existingRoles
                .map((role) => {
                    return `\` - \` @${allowedRoles.find((r) => r.id === role)?.name}`;
                })
                .join('\n')}${existingRoles.length < 1 && rolesToChange.length < 1 ? '' : '\n\n'}${
                rolesToChange.length < 1 ? '' : 'Added:\n'
            }${rolesToChange
                .map((role) => {
                    return `\` + \` @${allowedRoles.find((r) => r.id === role)?.name}`;
                })
                .join('\n')}${
                immutable.length < 1 ? '' : '\n\nErrored Roles (Probably because of permissions):\n'
            }${immutable.map((r) => `\` * \` @${r.name}`).join('\n')}`, // what the fuck is even going on anymore why do I even try
            `Role updates!`
        );

        return res.code(200).send({ message: 'Success!' });
    } else {
        return res.code(400).send({ message: 'Yikes!' });
    }
});
