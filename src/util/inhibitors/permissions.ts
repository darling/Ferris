import { Message } from 'discord.js';
import { messaging } from 'firebase-admin';
import { client } from '../../app';
import { Permissions } from '../../types/commands';
import { inhibitors } from '../inhibitor';

function missingCommandPerms() {
    console.log('Missing');
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
            return !msg.member?.permissionsIn(msg.channel).has(Permissions[perm]);
        });
        if (missingPermissions.length) {
            missingCommandPerms();
            // Missing reply goes here
            return true;
        }
    }

    if (command.userGuildPerms?.length) {
        const missingPermissions = command.userGuildPerms.filter((perm) => {
            return !msg.member?.hasPermission(Permissions[perm]);
        });
        if (missingPermissions.length) {
            missingCommandPerms();
            // Missing reply goes here
            return true;
        }
    }

    const bot = guild.me;
    if (!bot) throw Error("Bot isn't in the guild?");

    if (command.botChannelPerms?.length) {
        const missingPermissions = command.botChannelPerms.filter((perm) => {
            return bot.permissionsIn(msg.channel).has(Permissions[perm]);
        });
        if (missingPermissions.length) {
            missingCommandPerms();
            // Missing reply goes here
            return true;
        }
    }

    if (command.botGuildPerms?.length) {
        const missingPermissions = command.botGuildPerms.filter((perm) => {
            return bot.hasPermission(Permissions[perm]);
        });
        if (missingPermissions.length) {
            missingCommandPerms();
            // Missing reply goes here
            return true;
        }
    }

    return false;
});
