import { Guild, Message, MessageEmbed, TextChannel } from 'discord.js';
import { FerrisClient, db, client } from '../../app';
import { RunCommand } from '../../util/commandinterface';
import { loggingHooks, serverConfigs } from '../../util/serverInfo';
import { IDatabaseSchema } from '../../util/databaseFunctions';

const run: RunCommand = function (client: FerrisClient, msg: Message): void {
    if (!msg.guild) return;

    const channel: TextChannel = msg.channel as TextChannel;

    const guild: Guild = msg.guild;

    if (!serverConfigs.has(guild.id, 'logging')) {
        newWebhookLog(channel, guild);
    } else {
        changeWebhookLogChannel(channel, guild);
    }
};

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

export { run };
