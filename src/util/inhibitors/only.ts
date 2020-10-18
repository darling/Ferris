import { inhibitors } from '../inhibitor';

inhibitors.set('onlyIn', async (_msg, command, guild) => {
    if (command.guildOnly && !guild) return true;

    if (command.dmOnly && guild) return true;

    return false;
});
