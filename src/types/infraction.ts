export interface IInfraction {
    user: string;
    by?: string;
    automated?: boolean;
    reason?: string;
    date: number;
}
