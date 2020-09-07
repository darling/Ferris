import { Message, GuildMember } from 'discord.js';
import { FerrisClient } from '../app';

import { RunCommand } from './util/commandinterface';

const run: RunCommand = function (client: FerrisClient, msg: Message, args: string[]): void {
    if (!msg.mentions.members) {
        msg.reply('please mention a user to kick.');
        return;
    }

    if (!msg.member?.hasPermission('KICK_MEMBERS')) {
        msg.reply('You do not have permission to kick members.');
        return;
    }

    if (!msg.guild?.me!.hasPermission('KICK_MEMBERS')) {
        msg.reply('You do not have permission to kick members.');
        return;
    }

    let kickedMember: GuildMember | undefined = msg.mentions.members.first();

    if (!kickedMember?.kickable) {
        msg.reply('I can not kick this member.');
        return;
    }

    kickedMember.kick(args.join(' ')).then((member) => {
        msg.reply(`${member.user.tag} was kicked.`);
    });
};

export { run };
