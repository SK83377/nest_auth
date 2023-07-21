import { Document } from 'mongoose';

export interface Users extends Document {
    readonly name: string;
    readonly email: string;
    readonly phone: string;
    readonly password: string;
    readonly refreshTokenData: {
        refreshToken: string,
        refreshTokenIssued: number
    };
    readonly chatId: string;
}
