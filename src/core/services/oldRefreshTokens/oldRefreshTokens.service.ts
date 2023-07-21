import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { OldRefreshTokensDto } from './oldRefreshTokens.dto';
import { OldRefreshTokens } from 'src/core/database/oldRefreshTokens/oldRefreshTokens.interface';
import { OLD_REFRESH_TOKENS_MODEL } from '../../database/constants';

// @DB requests for 'oldRefreshTokens' collection.
@Injectable()
export class OldRefreshTokensService {
    constructor(
        @Inject(OLD_REFRESH_TOKENS_MODEL)
        private oldRefreshTokensModel: Model<OldRefreshTokens>,
    ) {}
    async getByRefreshToken (oldRefreshToken: string) {
        try {
            return await this.oldRefreshTokensModel.findOne({oldRefreshToken: oldRefreshToken});
        } catch (error) {
            console.log('OldRefreshTokensService.getById, error: ', error);
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    public async create (oldRefreshTokenData: OldRefreshTokensDto) {
        try {
            await this.oldRefreshTokensModel.create(oldRefreshTokenData);
        } catch (error) {
            console.log('OldRefreshTokensService.create, error: ', error);
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
