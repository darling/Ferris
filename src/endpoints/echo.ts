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
    },
};

server.post<{ Params: Params }>('/echo', postRes, async (req, res) => {
    const channel = await client.channels.fetch('811237223432716288');

    if (channel.isText()) {
        channel.send({
            content: `\`\`\`json\n${JSON.stringify(req.body, null, 2)}\`\`\``,
        });

        return res.code(200).send({ message: 'Success!' });
    }

    return res.code(400).send({ message: 'Yikes!' });
});
