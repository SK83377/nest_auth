import { number } from 'joi';
import * as mongoose from 'mongoose';

export const logInAttemptsSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: false
    },
    loginAttempts: {
        type: Number,
        required: true,
        unique: false
    },
    fATime: {
        type: Number,
        required: true,
        unique: false
    },
    code: {
        type: String,
        required: true,
        unique: false
    },
    codeTime: {
        type: Number,
        required: true,
        unique: false
    },
},
{
    collection: 'logInAttempts'
}
);