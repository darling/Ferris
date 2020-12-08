import { Guild, MessageEmbed, TextChannel } from 'discord.js';
import { serverConfigs } from '../../util/serverInfo';

import { client } from '../../app';
import { getConfig, getLoggingProps, updateLogChannelProperty } from '../../util/db/config';
import { ILoggingProps, typesAsArray } from '../../util/webhookLogging';

client.commands.set('setlogchannel', {
    name: 'setlogchannel',
    arguments: [
        {
            name: 'newLogChannel',
            type: 'textchannel',
            required: true,
            missing: (msg) => {
                const embed = new MessageEmbed();

                embed.setDescription('Please mention a channel or channel id');

                msg.channel.send(embed);
            },
        },
    ],
    guildOnly: true,
    run: (msg, args: LogArgs, guild) => {
        if (!guild) return;

        if (getConfig(guild.id)?.logging === undefined) {
            newWebhookLog(args.newLogChannel, guild);
        } else {
            changeWebhookLogChannel(args.newLogChannel, guild);
        }
    },
});

interface LogArgs {
    newLogChannel: TextChannel;
}

function getNewChannelEmbeds() {
    const embed = new MessageEmbed();
    embed.setTitle('New Logging Channel!');
    embed.setDescription(
        'All logging including website updates, user updates, and such that are enabled will be logged here.'
    );

    return embed;
}

async function changeWebhookLogChannel(channel: TextChannel, guild: Guild) {
    let loggingProps: ILoggingProps | undefined = getLoggingProps(guild.id);
    if (!loggingProps) return;

    const webhook = await client.fetchWebhook(loggingProps.webhook_id);

    await webhook.edit({ channel: channel }).then((webhook) => {
        webhook.send(getNewChannelEmbeds());
    });

    loggingProps.channel = channel.id;

    updateLogChannelProperty(guild.id, loggingProps);
}

async function newWebhookLog(channel: TextChannel, guild: Guild) {
    const webhook = await channel.createWebhook('Ferris Logging', {
        avatar: 'https://i.imgur.com/KLCVmAA.png',
        reason: 'To log items in this discord server.',
    });

    updateLogChannelProperty(guild.id, {
        channel: channel.id,
        enabled: true,
        subs: typesAsArray,
        webhook_id: webhook.id,
    });

    await webhook.send(getNewChannelEmbeds());
}
