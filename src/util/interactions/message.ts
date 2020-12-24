import {
    DMChannel,
    MessageAttachment,
    MessageEmbed,
    MessageOptions,
    NewsChannel,
    TextChannel,
} from 'discord.js';

type messageContent =
    | string
    | number
    | bigint
    | boolean
    | symbol
    | readonly any[]
    | (MessageOptions & { split?: false | undefined })
    | MessageEmbed
    | MessageAttachment
    | (MessageEmbed | MessageAttachment)[];

export function messageReply(
    channel: TextChannel | DMChannel | NewsChannel,
    contents: messageContent
) {
    channel.send(contents).catch((error) => {
        console.log(error);
    });
}
