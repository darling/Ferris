import { MessageEmbed, TextChannel } from 'discord.js';

export function sendSimpleEmbed(data: string, channel: TextChannel) {
    const embed = new MessageEmbed();

    embed.setDescription(data);
    embed.setColor(EmbedColors.WHITE);
    embed.setTimestamp();

    channel.send(embed);
}

export enum EmbedColors {
    RED = 16548225,
    WHITE = 16251644,
    GREEN100 = 15794164,
    GREEN200 = 13039317,
    GREEN300 = 10151604,
}
