import { Connection } from 'mongoose';
import { usersSchema } from './users.schema';
import { USERS_MODEL } from '../constants';
import { DATABASE_CONNECTION } from '../constants';

export const usersProviders = [
  {
    provide: USERS_MODEL,
    useFactory: (connection: Connection) => connection.model('users', usersSchema),
    inject: [DATABASE_CONNECTION],
  },
];