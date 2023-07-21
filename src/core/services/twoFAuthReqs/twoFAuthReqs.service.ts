import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { TwoFAuthReqs } from 'src/core/database/twoFAuthReqs/twoFAuthReqs.interface';
import { TWO_F_AUTH_REQS_MODEL } from '../../database/constants';
import { TwoFAuthReqsInterface } from './twoFAuthReqs.interface';

// @DB requests for 'twoFAuthReqs' collection.
@Injectable()
export class TwoFAuthReqsService {
    constructor(
        @Inject(TWO_F_AUTH_REQS_MODEL)
        private twoFAuthReqsModel: Model<TwoFAuthReqs>,
    ) {}
    public async getByCode (code: string) {
        try {
            return await this.twoFAuthReqsModel.findOne({code: code});
        } catch (error) {
            console.log('TwoFAuthReqsService.getByCode, error: ', error);
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    public async create (innerData: TwoFAuthReqsInterface) {
        try {
            await this.twoFAuthReqsModel.create(innerData);
        } catch (error) {
            console.log('TwoFAuthReqsService.create, error: ', error);
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    public async delete (code: string) {
        try {
            await this.twoFAuthReqsModel.deleteOne({code: code});
        } catch (error) {
            console.log('twoFAuthReqsModel.delete', error);
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
