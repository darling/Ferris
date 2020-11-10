import { Message } from 'discord.js';
import { messaging } from 'firebase-admin';
import { client } from '../../app';
import { Permissions } from '../../types/commands';
import { inhibitors } from '../inhibitor';

function missingCommandPerms(isBot: boolean, msg: Message, statement: string, type: string) {
    if (isBot) {
        msg.reply(
            'I do not have the permission to do this in this ' +
                type +
                '. Missing permission: ' +
                statement
        );
    } else {
        msg.reply(
            'You do not have permission to do this in this ' +
                type +
                '. Missing permissions: ' +
                statement
        );
    }
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
            missingCommandPerms(false, msg, JSON.stringify(command.userChannelPerms), 'channel');
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
            missingCommandPerms(false, msg, JSON.stringify(command.userGuildPerms), 'guild');
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
            missingCommandPerms(true, msg, JSON.stringify(command.botChannelPerms), 'channel');
            // Missing reply goes here
            return true;
        }
    }

    if (command.botGuildPerms?.length) {
        const missingPermissions = command.botGuildPerms.filter((perm) => {
            return !bot.hasPermission(Permissions[perm], { checkAdmin: true });
        });
        if (!!missingPermissions.length) {
            missingCommandPerms(true, msg, JSON.stringify(command.botGuildPerms), 'guild');
            // Missing reply goes here
            return true;
        }
    }

    return false;
});
