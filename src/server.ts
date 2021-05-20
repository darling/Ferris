import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { readdirSync } from 'fs';

export const server: FastifyInstance = Fastify({});

const start = async () => {
    try {
        await server.listen(8080);

        const address = server.server.address();
        const port = typeof address === 'string' ? address : address?.port;

        console.log(`Live on port ${port}`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

// Sync because we can't have nice things now can we
readdirSync(__dirname + '/endpoints', { withFileTypes: false }).forEach((file: any) => {
    require(`./endpoints/${file}`);
});

start();
