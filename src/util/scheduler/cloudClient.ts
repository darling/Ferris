import { CloudTasksClient } from '@google-cloud/tasks';
import { google } from '@google-cloud/tasks/build/protos/protos';
import admin from 'firebase-admin';

const LOCATION = 'us-central1';
const QUEUE_NAME = 'iron-schedule';

const client = new CloudTasksClient();
const parent = client.queuePath('ferrisbot-6e0f1', LOCATION, QUEUE_NAME);

const BASE_URL = 'http://iron.ferris.gg';
const WEB_URL = 'https://ferris.gg/api';

export const newTask = async (url: string, payload: string, inSeconds: number) => {
    const task: google.cloud.tasks.v2.ITask = {
        httpRequest: {
            httpMethod: 'POST',
            url,
            body: Buffer.from(payload).toString('base64'),
        },
        scheduleTime: { seconds: inSeconds + Date.now() / 1000 },
    };

    const request = { parent, task };
    const [response] = await client.createTask(request);
    console.log('Created ' + response);
    return response;
};
