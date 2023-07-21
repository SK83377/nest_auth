import { string } from 'joi';
import * as mongoose from 'mongoose';

export const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
      },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    refreshTokenData: {
        refreshToken: {
            type: String
        },
        refreshTokenIssued: {
            type: Number
        }
    },
    chatId: {
	    type: String,
	    required: false
    },
});
