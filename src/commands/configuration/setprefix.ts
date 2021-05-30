import { client } from '../../app';
import { changePrefix, getPrefix } from '../../util/db/prefix';
import { successEmbed } from '../../util/embedTemplates';

client.commands.set('setprefix', {
    name: 'setprefix',
    aliases: ['prefix'],
    guildOnly: true,
    arguments: [
        {
            name: 'newPrefix',
            type: 'string',
            required: false,
        },
    ],
    userGuildPerms: ['MANAGE_GUILD'],
    run: async (msg, args: EchoArgs, guild) => {
        if (!guild) return;

        if (args.newPrefix) {
            await changePrefix(guild.id, args.newPrefix);
        }

        successEmbed(
            msg.channel,
            `The prefix is ${args.newPrefix ? 'now ' : ''}\`${
                args.newPrefix || (await getPrefix(guild.id)) || ';'
            }\``
        );
    },
    description:
        "This command allows you to **change** the Ferris bot prefix to __any character__ that you would like. This is great to make sure **2 bots** don't have the __same__ prefix.",
});

interface EchoArgs {
    newPrefix?: string;
}
