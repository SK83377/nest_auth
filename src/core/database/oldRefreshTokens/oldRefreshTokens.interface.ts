import { Document } from 'mongoose';

export interface OldRefreshTokens extends Document {
    readonly userId: string;
    readonly oldRefreshToken: string;
}