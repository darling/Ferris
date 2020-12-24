import { MessageEmbed } from 'discord.js';
import { freemem, totalmem } from 'os';
import { memoryUsage } from 'process';

import { client } from '../../app';
import { PermissionLevels } from '../../types/commands';

client.commands.set('memuse', {
    name: 'memuse',
    arguments: [],
    permissionLevels: [PermissionLevels.BOT_DEV],
    run: (msg, args: MemArgs) => {
        const embed = new MessageEmbed();

        embed.setTitle('MEM USAGE');
        embed.addField('Total Memory', bytesToMb(totalmem()));
        embed.addField('Free Memory', bytesToMb(freemem()));
        embed.addField('Used Memory', bytesToMb(totalmem() - freemem()));
        embed.addField('RSS', bytesToMb(memoryUsage().rss));
        embed.addField('Total Heap', bytesToMb(memoryUsage().heapTotal));
        embed.addField('Heap used', bytesToMb(memoryUsage().heapUsed));

        msg.channel.send(embed);
    },
});

interface MemArgs {}

function bytesToMb(bytes: number) {
    const MB = Math.round((bytes / 1024 / 1024) * 100) / 100;
    return MB < 1000 ? `${MB} MB` : `${Math.round((MB / 1000) * 100) / 100} GB`;
}
