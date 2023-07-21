import * as mongoose from 'mongoose';

export const oldRefreshTokensSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: false
    },
    oldRefreshToken: {
        type: String,
        required: true,
        unique: false
    },
},
{
    collection: 'oldRefreshTokens'
}
);