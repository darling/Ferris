import { RouteShorthandOptions } from 'fastify';
import { server } from '../server';

const pingOpts: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    pong: {
                        type: 'string',
                    },
                },
            },
        },
    },
};

server.get('/ping', pingOpts, async (req, res) => {
    return { pong: 'It works!' };
});
