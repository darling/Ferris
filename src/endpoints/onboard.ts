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

server.post<{ Params: Params }>('/onboard/:id', postRes, async (req, res) => {
    const id = req.params.id;

    if (id) {
        const user = await client.users.fetch(id);

        const dmChannel = await user.createDM();

        successEmbed(
            dmChannel,
            "Thank you for signing up with Ferris and we hope that this is the beginning of a great partnership. If you have any questions at all, please don't hesitate to contact us- our team loves helping out new members!\n\nWe have compiled a list of links and some extra information for you. Quick Links:\n\n[Documentation](https://ferris.gg/docs)\n[Getting Started](https://ferris.gg/docs/getting-started)\n[Control Panel](https://ferris.gg/control)\n[Our Discord Server](https://ferris.gg/discord)",
            'Welcome!'
        );

        const safeUser = await client.users.fetch('141075183271280641');

        const safesDm = await safeUser.createDM();

        successEmbed(safesDm, 'Someone new signed in for the first time (or in a while)!', 'Yay!');

        return res.code(200).send({ message: 'Success!' });
    } else {
        return res.code(400).send({ message: 'Yikes!' });
    }
});
