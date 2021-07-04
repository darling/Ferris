import { round } from 'lodash';
import { admin, swap } from '../app';

export interface IXPCache {
    lastXpGiven?: number;
}

export const xpUserCache = new Map<string, IXPCache>();

export const giveXP = async (uid: string, amount: number) => {
    const ref = swap.ref(`/users/${uid}`);

    const snapshot = await ref.once('value');
    const data: { xp?: number; level?: number } = snapshot.val();

    let level = (data?.level as number) || 0;
    let xp = (data?.xp as number) || 0;

    const xpNeededTillNextLevel = xpToNextLvl(level);

    xp = xp + 1;

    console.log('CURRENT XP', xp, 'XP TO LEVEL', xpNeededTillNextLevel);
    console.log('CURRENT LEVEL', level, 'NEXT LEVEL', level + 1);

    if (xp >= xpNeededTillNextLevel) {
        xp = xp - xpNeededTillNextLevel;
        level += 1;
    }

    const date = Date.now();
    xpUserCache.set(uid, { lastXpGiven: date });

    ref.update({
        level: round(level),
        xp: round(xp),
        credit: admin.database.ServerValue.increment(1),
    });
};

export const chatXP = (uid: string) => {
    giveXP(uid, 20);
};

export const xpToNextLvl = (level: number) => {
    return round(0.04 * (level ^ 3) + 0.8 * (level ^ 2) + 2 * level);
};

for (let index = 0; index < 20; index++) {
    console.log(xpToNextLvl(index));
}
