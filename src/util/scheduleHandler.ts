import { firestore, admin } from '../app';
import { pendingUnpunishments } from './serverInfo';
import ms from 'ms';
import { unbanUserFromGuild } from './banFunctions';
import { unmuteUserFromGuild } from './muteFunctions';

const config = {
    /*
        The window for which the database looks for the next few bans is whatever this is set to.

        If the number of calls gets past something I can handle, I will lower this number.
    */
    windowMs: ms('24h'),
};

function getFirestoreData(): () => void {
    return firestore
        .collectionGroup('punishments')
        .where('time', '<=', admin.firestore.Timestamp.fromMillis(Date.now() + config.windowMs))
        .where(
            'time',
            '>=',
            admin.firestore.Timestamp.fromMillis(Date.now() + -1 * config.windowMs)
        )
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((update) => {
                let doc = update.doc;
                let data = doc.data();

                switch (update.type) {
                    case 'added':
                        if (data.completed || data.time.toDate() <= Date.now()) {
                            doc.ref.delete();
                        }

                        const event = setTimeout(() => {
                            switch (data.type) {
                                case 'ban':
                                    unbanUserFromGuild(data.guild, doc.id);
                                    break;

                                case 'mute':
                                    break;
                            }

                            pendingUnpunishments.delete(doc.id);
                            doc.ref.delete();
                        }, data.time.toDate() - Date.now());

                        pendingUnpunishments.set(doc.id, {
                            event: event,
                            data: data,
                            document: doc,
                        });

                        break;
                    case 'modified':
                        if (data.completed || data.time.toDate() <= Date.now()) {
                            doc.ref.delete();
                        }

                        break;
                    case 'removed':
                        unmuteUserFromGuild(data.guild, doc.id);

                        if (pendingUnpunishments.has(doc.id)) {
                            const pendingDoc = pendingUnpunishments.get(doc.id);
                            clearTimeout(pendingDoc.event);
                            pendingUnpunishments.delete(doc.id);
                        }

                        break;

                    default:
                        break;
                }
            });
        });
}

async function runSchedule() {
    let unsub = getFirestoreData();

    setInterval(() => {
        unsub();
        unsub = getFirestoreData();
    }, config.windowMs);
}

export default runSchedule;
