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

        const config = await getConfig(guild.id);

        if (config?.logging === undefined) {
            newWebhookLog(args.newLogChannel, guild); // TODO: HERE
        } else {
            updateLogChannelProperty(guild.id, {
                channel: args.newLogChannel.id,
            });

            await args.newLogChannel.send(getNewChannelEmbeds());
        }
    },
    iconName: 'log',
    description:
        'This command can be used to set your **preferred** logging channel. This channel will be used to __keep logs of day-to-day activities__ such as message deletions, joins, and mod logs.',
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

async function newWebhookLog(channel: TextChannel, guild: Guild) {
    try {
        updateLogChannelProperty(guild.id, {
            channel: channel.id,
            enabled: true,
            subs: typesAsArray,
        });

        await channel.send(getNewChannelEmbeds());
    } catch (error) {
        console.log(error);
    }
}
