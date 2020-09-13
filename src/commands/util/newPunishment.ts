import { admin, firestore } from '../../app';

interface newPunishmentData {
    member: string,
    guild: string,
    channel: string,
    completed: false,
    desc?: string,
    type: 'mute' | 'ban',
    roles: string[],
    author: string,
    time?: admin.firestore.Timestamp,
    timeGiven?: admin.firestore.Timestamp
}

interface updatePunishmentData {
    member: string
    guild: string,
    completed?: false,
    desc?: string,
    time?: admin.firestore.Timestamp
}

function newPunishment(timeSpecified: number, data: newPunishmentData ) {
    let time = admin.firestore.Timestamp.fromMillis(Date.now() + timeSpecified);
    let timeGiven = admin.firestore.Timestamp.now();

    let docData = data;

    docData.time = time;
    docData.timeGiven = timeGiven;

    let document = firestore
        .collection('guilds')
        .doc(data.guild)
        .collection('punishments')
        .doc(data.member);

    document.set(docData);
}

function updatePunishment(data: updatePunishmentData ) {
    let docData = data;

    let document = firestore
        .collection('guilds')
        .doc(data.guild)
        .collection('punishments')
        .doc(data.member);

    document.set(docData);
}

export default newPunishment;