import ms from 'ms';
import { passiveTests } from '../passiveTest';
import { chatXP, xpUserCache } from '../xp';

const cooldown = ms('2m');

passiveTests.set('xp-collector', async (msg) => {
    const uid = msg.author.id;

    if (xpUserCache.has(uid)) {
        const oldDate = xpUserCache.get(uid)?.lastXpGiven || 0;
        const now = Date.now();

        if (now - cooldown > oldDate) {
            // AFTER THE COOLDOWN
            chatXP(msg.author.id);
        } else {
            // WAITING FOR COOLDOWN
            // console.log((oldDate + cooldown - now) / 1000);
        }
    } else {
        chatXP(msg.author.id);
    }

    return undefined;
});
