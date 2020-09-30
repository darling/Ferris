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
                if (update.type == 'added') {
                    if (data.completed) {
                        update.doc.ref.delete();
                    }

                    if (data.time.toDate() <= Date.now()) {
                        // Delete records that haven't been completed while the bot was down
                        // These entries will still be completed below, but the records need to be cleaned out.
                        update.doc.ref.delete();
                    }

                    console.log('New ' + data.type + ' to be undone at ' + data.time.toDate());

                    const event = setTimeout(() => {
                        if (data.type == 'ban') {
                            (client.channels.cache.get(data.channel) as TextChannel).send(
                                'Unbanned!'
                            );
                            console.log(`Unbanning ${update.doc.id} from ${data.guild}`);
                            unbanUserFromGuild(data.guild, update.doc.id);
                            pendingUnpunishments.delete(update.doc.id);
                        } else if (data.type == 'mute') {
                            (client.channels.cache.get(data.channel) as TextChannel).send(
                                'Unmuted!'
                            );
                            unmuteUserFromGuild(data.guild, update.doc.id, data.roles);
                            pendingUnpunishments.delete(update.doc.id);
                        }
                        update.doc.ref.delete();
                    }, data.time.toDate() - Date.now());

                    if (data.time.toDate() >= Date.now()) {
                        pendingUnpunishments.set(update.doc.id, {
                            event: event,
                            data: data,
                            document: update.doc,
                        });
                    }
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
