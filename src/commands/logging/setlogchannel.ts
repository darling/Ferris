import { Guild, MessageEmbed, TextChannel } from 'discord.js';
import { serverConfigs } from '../../util/serverInfo';

import { client } from '../../app';
import { getConfig, getLoggingProps, updateLogChannelProperty } from '../../util/db/config';
import { ILoggingProps, typesAsArray } from '../../util/webhookLogging';
import { missingParamEmbed } from '../../util/embedTemplates';
import { EmbedColors } from '../../util/embed';

client.commands.set('setlogchannel', {
    name: 'setlogchannel',
    arguments: [
        {
            name: 'newLogChannel',
            type: 'textchannel',
            required: true,
            missing: (msg) => {
                missingParamEmbed(msg.channel, 'Please mention a channel or channel id');
            },
        },
    ],
    guildOnly: true,
    botGuildPerms: ['MANAGE_WEBHOOKS'],
    botChannelPerms: ['MANAGE_WEBHOOKS'],
    userGuildPerms: ['MANAGE_GUILD'],
    run: async (_msg, args: LogArgs, guild) => {
        if (!guild) return;

        if ((await getConfig(guild.id))?.logging === undefined) {
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
    embed.setColor(EmbedColors.GREEN100);
    embed.setTimestamp();
    embed.setDescription(
        'All logging including website updates, user updates, and such that are enabled will be logged here.'
    );

    return embed;
}

async function changeWebhookLogChannel(channel: TextChannel, guild: Guild) {
    let loggingProps: ILoggingProps | undefined = getLoggingProps(guild.id);
    if (!loggingProps) return;

    try {
        const webhook = await client.fetchWebhook(loggingProps.webhook_id);

        webhook.edit({ channel: channel }).then((webhook) => {
            webhook.send(getNewChannelEmbeds());
        });
    } catch (e) {
        newWebhookLog(channel, guild);
        return;
    }

    loggingProps.channel = channel.id;

    updateLogChannelProperty(guild.id, loggingProps);
}

async function newWebhookLog(channel: TextChannel, guild: Guild) {
    try {
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
    } catch (error) {
        console.log(error);
    }
}
