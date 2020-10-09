import { MessageEmbed, TextChannel } from 'discord.js';

export function sendSimpleEmbed(data: string, channel: TextChannel) {
    const embed = new MessageEmbed();

    embed.setDescription(data);
    embed.setColor(16646143);
    embed.setTimestamp();

    channel.send(embed);
}
