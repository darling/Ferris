import { User } from 'discord.js';

function getAvatar(id: string, avatar: string): string {
    if (avatar.startsWith('a_')) {
        return `https://cdn.discordapp.com/avatars/${id}/${avatar}.gif`;
    } else {
        return `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
    }
}

export { getAvatar };
