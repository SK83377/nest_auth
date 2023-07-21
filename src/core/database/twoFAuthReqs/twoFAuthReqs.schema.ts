import { number } from 'joi';
import * as mongoose from 'mongoose';

export const twoFAuthReqsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: false
    },
    code: {
        type: String,
        required: true,
        unique: false
    },
    codeExpTime: {
        type: Number,
        required: true,
        unique: false
    },
},
{
    collection: 'twoFAuthReqs'
}
);