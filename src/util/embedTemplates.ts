import { DMChannel, Message, MessageEmbed, NewsChannel, TextChannel } from 'discord.js';
import { EmbedColors } from './embed';
import { messageReply } from './interactions/message';

const embedErrorImages: string[] = [
    'https://i.imgur.com/u9thkve.png',
    'https://i.imgur.com/ySaWfja.png',
    'https://i.imgur.com/Cnr4nmS.png',
];

export function errorEmbed(
    channel: TextChannel | DMChannel | NewsChannel,
    description: string,
    title?: string
): void {
    const embed = new MessageEmbed();

    embed.setColor(EmbedColors.RED);
    embed.setTimestamp();
    embed.setThumbnail(embedErrorImages[Math.floor(Math.random() * embedErrorImages.length)]);
    embed.setDescription(description);
    embed.setTitle(title || 'Uh Oh!');

    messageReply(channel, embed);
}

export function getSuccessEmbed() {
    const embed = new MessageEmbed();

    embed.setColor(EmbedColors.GREEN100);
    embed.setTimestamp();

    return embed;
}

export function missingParamEmbed(
    channel: TextChannel | DMChannel | NewsChannel,
    description: string,
    title?: string
): void {
    const embed = new MessageEmbed();

    embed.setColor(EmbedColors.RED);
    embed.setTimestamp();
    embed.setThumbnail(embedErrorImages[Math.floor(Math.random() * embedErrorImages.length)]);
    embed.setDescription(description);
    embed.setTitle(title || 'Missing Parameter!');

    messageReply(channel, embed);
}
