import { admin, firestore } from '../app';

interface INewPunishmentData {
    member: string;
    guild: string;
    channel: string;
    completed?: boolean;
    desc?: string;
    type: 'mute' | 'ban';
    roles: string[];
    author: string;
    time: admin.firestore.Timestamp;
    timeGiven?: admin.firestore.Timestamp;
}

interface IUpdatePunishmentData {
    member: string;
    guild: string;
    completed?: false;
    desc?: string;
    time?: admin.firestore.Timestamp;
}

function newPunishment(data: INewPunishmentData) {
    let timeGiven = admin.firestore.Timestamp.now();

    let docData = data;

    docData.timeGiven = timeGiven;
    docData.completed = false;

    let document = firestore
        .collection('guilds')
        .doc(data.guild)
        .collection('punishments')
        .doc(data.member);

    document.set(docData);
}

function updatePunishment(data: IUpdatePunishmentData) {
    let document = firestore
        .collection('guilds')
        .doc(data.guild)
        .collection('punishments')
        .doc(data.member);

    document.update(data);
}

export { newPunishment, updatePunishment, INewPunishmentData };
