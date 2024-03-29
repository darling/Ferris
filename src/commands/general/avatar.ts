import { Guild, GuildMember, MessageEmbed } from 'discord.js';
import moment from 'moment';

import { client } from '../../app';
import { messageReply } from '../../util/interactions/message';

client.commands.set('avatar', {
    name: 'avatar',
    aliases: ['pp', 'a', 'profilepicture', 'av'],
    arguments: [
        {
            name: 'user',
            type: 'member',
            required: false,
        },
    ],
    run: (msg, args: Args, guild) => {
        const member = args.user || msg.member;
        if (!member || !guild) return;

        const embed = new MessageEmbed();

        embed.setColor(16646143);

        embed.setTitle(`${member.user.tag}`);

        embed.setDescription(
            `[\`LINK\`](${member.user.displayAvatarURL({
                dynamic: false,
                size: 4096,
                format: 'png',
            })})${
                member.user.avatar?.startsWith('a_')
                    ? ` • [\`GIF LINK\`](${member.user.displayAvatarURL({
                          dynamic: true,
                          size: 4096,
                          format: 'gif',
                      })})`
                    : ''
            }`
        );

        embed.setImage(
            `${member.user.displayAvatarURL({ dynamic: true, size: 4096, format: 'png' })}`
        );

        embed.setFooter(`ID: ${member.user.id}`).setTimestamp(new Date());

        messageReply(msg.channel, embed);
    },
    description:
        "The avatar command allows you to** get the image** of any Discord user's __profile picture.__ This is a** copyable image format** that can be used for __anyone__ on the server. ",
});

interface Args {
    user?: GuildMember;
}
