import { Message, MessageEmbed } from 'discord.js';
import { sample } from 'lodash';

import { client } from '../../app';
import { Permission, Permissions } from '../../types/commands';
import { EmbedColors } from '../embed';
import { inhibitors } from '../inhibitor';

const funnyDescription = (): string => {
    return (
        sample([
            'Task failed successfully...',
            'If you see this, you win!',
            'Uh oh',
            'Is Ferris okay?',
        ]) || 'If you see this this is a problem...'
    );
};

function missingCommandPerms(
    isBot: boolean,
    msg: Message,
    permissions: Permission[],
    type: string
) {
    const embed = new MessageEmbed();

    embed.setColor(EmbedColors.RED);
    embed.setTitle("We've found some missing permissions.");
    embed.setDescription(
        `${
            isBot ? `<@${client.user?.id}>` : `<@${msg.author.id}>`
        } is missing the \`${permissions.toString()}\` permission${
            permissions.length > 1 ? 's' : ''
        } in this ${type}`
    );
    embed.setTimestamp();
    embed.setFooter(funnyDescription(), client.user?.avatarURL() || undefined);

    msg.channel.send(embed).catch((reason) => {
        console.error(reason);
    });
}

inhibitors.set('permissions', async (msg, command, guild) => {
    if (
        !command.botChannelPerms?.length &&
        !command.botGuildPerms?.length &&
        !command.userChannelPerms?.length &&
        !command.userGuildPerms?.length
    ) {
        return false;
    }

    if (!guild) return false;

    // check if bot is in guild?

    if (command.userChannelPerms?.length) {
        const missingPermissions = command.userChannelPerms.filter((perm) => {
            return !msg.member?.permissionsIn(msg.channel).has(Permissions[perm], true);
        });
        if (!!missingPermissions.length) {
            missingCommandPerms(false, msg, command.userChannelPerms, 'channel');
            // Missing reply goes here
            return true;
        }
    }

    if (command.userGuildPerms?.length) {
        const missingPermissions = command.userGuildPerms.filter((perm) => {
            return !msg.member?.hasPermission(Permissions[perm], {
                checkAdmin: true,
                checkOwner: true,
            });
        });
        if (!!missingPermissions.length) {
            missingCommandPerms(false, msg, command.userGuildPerms, 'guild');
            // Missing reply goes here
            return true;
        }
    }

    const bot = guild.me;
    if (!bot) throw Error("Bot isn't in the guild?");

    if (command.botChannelPerms?.length) {
        const missingPermissions = command.botChannelPerms.filter((perm) => {
            return !bot.permissionsIn(msg.channel).has(Permissions[perm], true);
        });
        if (!!missingPermissions.length) {
            missingCommandPerms(true, msg, command.botChannelPerms, 'channel');
            // Missing reply goes here
            return true;
        }
    }

    if (command.botGuildPerms?.length) {
        const missingPermissions = command.botGuildPerms.filter((perm) => {
            return !bot.hasPermission(Permissions[perm], { checkAdmin: true });
        });
        if (!!missingPermissions.length) {
            missingCommandPerms(true, msg, command.botGuildPerms, 'guild');
            // Missing reply goes here
            return true;
        }
    }

    return false;
});
