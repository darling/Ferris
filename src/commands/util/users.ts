function getAvatar(id: string, avatar: string) {
    if (avatar.startsWith('a_')) {
        return `https://cdn.discordapp.com/avatars/${id}/${avatar}.gif`;
    } else {
        return `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
    }
}

export { getAvatar };
