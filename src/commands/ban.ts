import { Message, GuildMember, MessageEmbed } from 'discord.js';
import { FerrisClient } from '../app';

import { RunCommand } from './util/commandinterface';

const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
    if (!msg.mentions.members) {
        msg.reply('please mention a user to ban.');
        return;
    }

    if (!msg.member?.hasPermission('BAN_MEMBERS')) {
        msg.reply('You do not have permission to ban members.');
        return;
    }

    if (!msg.guild?.me!.hasPermission('BAN_MEMBERS')) {
        msg.reply('You do not have permission to ban members.');
        return;
    }

    let bannedMember: GuildMember | undefined = msg.mentions.members.first();

    if (!bannedMember?.bannable) {
        msg.reply('I can not ban this member.');
        return;
    }

    bannedMember.ban({ days: 3, reason: args.join(' ') }).then((member) => {
        let embed = new MessageEmbed();
        embed.setColor(16646143);
        embed.setTitle(member.user.username + ' has been banned!');
        embed.setDescription('He got the hammer.');
        embed.setThumbnail('https://i.imgur.com/NG469Iv.png');
        embed.setAuthor(msg.author.tag, msg.author.avatarURL()!);
        msg.channel.send(embed);
    });
};

export { run };
