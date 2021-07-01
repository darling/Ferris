import { RouteShorthandOptions } from 'fastify';

import { client } from '../app';
import { server } from '../server';
import { successEmbed } from '../util/embedTemplates';

interface Params {
    id?: string;
}

const postRes: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: {
                        type: 'number',
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
        params: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                },
            },
        },
    },
};

server.get<{ Params: Params }>('/permissions/:id', postRes, async (req, res) => {
    const id = req.params.id;

    if (id) {
        const permissions = client.guilds.cache.get(id)?.me?.permissions.bitfield || 0;

        return res.code(200).send({ message: permissions });
    } else {
        return res.code(400).send({ message: 'Yikes!' });
    }
});
