import { Document } from 'mongoose';

export interface LogInAttempts extends Document {
  //readonly _id: string;
  readonly phone: string;
  readonly loginAttempts: number;
  readonly fATime: number;
  readonly code: string;
  readonly codeTime: number;
}