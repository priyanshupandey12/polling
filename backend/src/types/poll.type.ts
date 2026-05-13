export interface CreatePollInput {
    title: string;
    desc: string | null;
    expiresAt: Date;
    isAnonymous: boolean;
}