import { Message, MessageEmbed } from 'discord.js';
import { FerrisClient } from '../app';

import { RunCommand } from './util/commandinterface';
import { pendingUnpunishments } from '../util/serverinfo';

import moment from 'moment';

const run: RunCommand = function (client: FerrisClient, msg: Message): void {
    const embed = new MessageEmbed();

    embed.setTitle('Pending Unbans');
    pendingUnpunishments.forEach((unban: { data: { time: any } }, key: any) => {
        console.log(key, unban.data.time.toDate());

        embed.addField(key, moment(unban.data.time.toDate()).fromNow());
    });
    msg.channel.send(embed);
};

export { run };
