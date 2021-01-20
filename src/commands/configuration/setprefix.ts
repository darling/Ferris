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
});

interface EchoArgs {
    newPrefix?: string;
}
