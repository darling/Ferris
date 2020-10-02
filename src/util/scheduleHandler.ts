import { firestore, client, admin } from '../app';
import { pendingUnpunishments } from './serverInfo';
import ms from 'ms';
import { unbanUserFromGuild } from './banFunctions';
import { TextChannel } from 'discord.js';
import { unmuteUserFromGuild } from './muteFunctions';

function getFirestoreData(): () => void {
    return firestore
        .collectionGroup('punishments')
        .where('time', '<=', admin.firestore.Timestamp.fromMillis(Date.now() + ms('1d')))
        .where('time', '>=', admin.firestore.Timestamp.fromMillis(Date.now() + ms('-1d')))
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((update) => {
                let data = update.doc.data();

                switch (update.type) {
                    case 'added':
                        console.log('ADDED ENTRY');

                        if (data.completed || data.time.toDate() <= Date.now()) {
                            update.doc.ref.delete();
                        }

                        const event = setTimeout(() => {
                            switch (data.type) {
                                case 'ban':
                                    console.log(`Unbanning ${update.doc.id} from ${data.guild}`);
                                    unbanUserFromGuild(data.guild, update.doc.id);
                                    break;

                                case 'mute':
                                    console.log(`Unmute ${update.doc.id} from ${data.guild}`);
                                    unmuteUserFromGuild(data.guild, update.doc.id, data.roles);
                                    break;
                            }
                            pendingUnpunishments.delete(update.doc.id);
                            update.doc.ref.delete();
                        }, data.time.toDate() - Date.now());

                        pendingUnpunishments.set(update.doc.id, {
                            event: event,
                            data: data,
                            document: update.doc,
                        });

                        break;
                    case 'modified':
                        console.log('MODIFIED ENTRY');

                        if (data.completed || data.time.toDate() <= Date.now()) {
                            update.doc.ref.delete();
                        }

                        break;
                    case 'removed':
                        console.log('REMOVED ENTRY');

                        const doc = pendingUnpunishments.get(update.doc.id);
                        clearTimeout(doc.event);
                        pendingUnpunishments.delete(update.doc.id);

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
    }, ms('1d'));
}

export default runSchedule;
