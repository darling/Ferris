import { ServiceAccount } from 'firebase-admin';
import { config } from 'process';

export interface IConfig {
    token: string;
    firebase: ServiceAccount | string;
}
