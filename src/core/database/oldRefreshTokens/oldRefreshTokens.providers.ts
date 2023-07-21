import { Connection } from 'mongoose';
import { oldRefreshTokensSchema } from './oldRefreshTokens.schema';
import { OLD_REFRESH_TOKENS_MODEL } from '../constants';
import { DATABASE_CONNECTION } from '../constants';

export const oldRefreshTokensProviders = [
  {
    provide: OLD_REFRESH_TOKENS_MODEL,
    useFactory: (connection: Connection) => connection.model('oldRefreshTokens', oldRefreshTokensSchema),
    inject: [DATABASE_CONNECTION],
  },
];