import * as mongoose from 'mongoose';
import { env } from 'process';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(`mongodb://${env.MONGO_USER}:${env.MONGO_PASS}@${env.MONGO_ADDRESS}`,{dbName: 'eventSellerDB'}),
  },
];