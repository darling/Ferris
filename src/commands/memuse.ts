import { Message, MessageEmbed } from 'discord.js';
import { freemem, totalmem } from 'os';
import { memoryUsage } from 'process';
import { FerrisClient } from '../app';

import { RunCommand } from './util/commandinterface';

const run: RunCommand = function (client: FerrisClient, msg: Message): void {
    const embed = new MessageEmbed();

    embed.setTitle('MEM USAGE');
    embed.addField('Total Memory', bytesToMb(totalmem()));
    embed.addField('Free Memory', bytesToMb(freemem()));
    embed.addField('Used Memory', bytesToMb(totalmem() - freemem()));
    embed.addField('RSS', bytesToMb(memoryUsage().rss));
    embed.addField('Total Heap', bytesToMb(memoryUsage().heapTotal));
    embed.addField('Heap used', bytesToMb(memoryUsage().heapUsed));

    msg.channel.send(embed);
};

function bytesToMb(bytes: number) {
    return `${Math.round((bytes / 1024 / 1024) * 100) / 100} MB`;
}

export { run };
