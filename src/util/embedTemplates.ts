import { Message, MessageEmbed } from 'discord.js';
import { EmbedColors } from './embed';

const embedErrorImages: string[] = [
    'https://i.imgur.com/u9thkve.png',
    'https://i.imgur.com/ySaWfja.png',
    'https://i.imgur.com/Cnr4nmS.png',
];

export function getErrorEmbed(): MessageEmbed {
    const embed = new MessageEmbed();

    embed.setColor(EmbedColors.RED);
    embed.setTimestamp();

    embed.setThumbnail(embedErrorImages[Math.floor(Math.random() * embedErrorImages.length)]);

    return embed;
}

export function missingParamEmbed(description: string): MessageEmbed {
    return getErrorEmbed().setTitle('Missing Parameter!').setDescription(description);
}
