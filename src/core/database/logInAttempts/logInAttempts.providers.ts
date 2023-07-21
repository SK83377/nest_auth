import { Connection } from 'mongoose';
import { logInAttemptsSchema } from './logInAttempts.schema';
import { LOG_IN_ATTEMPTS_MODEL } from '../constants';
import { DATABASE_CONNECTION } from '../constants';

export const logInAttemptsProviders = [
  {
    provide: LOG_IN_ATTEMPTS_MODEL,
    useFactory: (connection: Connection) => connection.model('logInAttempts', logInAttemptsSchema),
    inject: [DATABASE_CONNECTION],
  },
];