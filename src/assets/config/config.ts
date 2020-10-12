import { ServiceAccount } from 'firebase-admin';

export interface IConfig {
    token: string;
    firebase: ServiceAccount | string;
}

export const config: IConfig = require('./../../../config.json');
