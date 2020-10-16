import { Guild, MessageEmbed, TextChannel } from 'discord.js';
import { db } from '../../app';
import { loggingHooks, serverConfigs } from '../../util/serverInfo';
import { IDatabaseSchema } from '../../util/databaseFunctions';

import { client } from '../../app';

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

        if (serverConfigs.has(guild.id, 'logging')) {
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
    const webhookID: IDatabaseSchema | undefined = serverConfigs.get(guild.id);
    if (!webhookID || !webhookID.logging) return;

    const webhook = await client.fetchWebhook(webhookID.logging.webhookID);

    await webhook.edit({ channel: channel }).then((webhook) => {
        webhook.send(getNewChannelEmbeds());
        loggingHooks.set(guild.id, webhook);
    });

    await db.ref(`guilds/${guild.id}/logging`).update({
        channel: channel.id,
    });
}

async function newWebhookLog(channel: TextChannel, guild: Guild) {
    const webhook = await channel.createWebhook('Ferris Logging', {
        avatar: 'https://i.imgur.com/KLCVmAA.png',
        reason: 'To log items in this discord server.',
    });

    await db.ref(`guilds/${guild.id}/logging`).update({
        channel: channel.id,
        enabled: true,
        subs: 0,
        webhookID: webhook.id,
    });

    loggingHooks.set(guild.id, webhook);

    await webhook.send(getNewChannelEmbeds());
}
