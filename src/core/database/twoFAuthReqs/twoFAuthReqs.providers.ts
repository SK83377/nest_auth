import { Connection } from 'mongoose';
import { twoFAuthReqsSchema } from './twoFAuthReqs.schema';
import { TWO_F_AUTH_REQS_MODEL } from '../constants';
import { DATABASE_CONNECTION } from '../constants';

export const twoFAuthReqsProviders = [
  {
    provide: TWO_F_AUTH_REQS_MODEL,
    useFactory: (connection: Connection) => connection.model('twoFAuthReqs', twoFAuthReqsSchema),
    inject: [DATABASE_CONNECTION],
  },
];