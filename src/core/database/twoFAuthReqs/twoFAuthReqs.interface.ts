import { Document } from 'mongoose';

export interface TwoFAuthReqs extends Document {
  readonly userId: string;
  readonly code: string;
  readonly codeExpTime: number;
}