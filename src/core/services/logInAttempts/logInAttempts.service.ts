import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { LogInAttempts } from '../../database/logInAttempts/logInAttempts.interface';
import { LOG_IN_ATTEMPTS_MODEL } from '../../database/constants';
import { LogInAttemptsDto } from './logInAttempts.dto';

// @DB requests for 'logInAttempts' collection.
@Injectable()
export class LogInAttemptsService {
    constructor(
        @Inject(LOG_IN_ATTEMPTS_MODEL)
        private logInAttemptsModel: Model<LogInAttempts>,
    ) {}
    public async getByPhone (phone: string) {
        try {
            const logInAttempt = await this.logInAttemptsModel.findOne({phone: phone});
            return logInAttempt;
        } catch (error) {
            console.log('LogInAttemptsService.getByPhone', error);
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    public async create (attemptData: LogInAttemptsDto) {
        try {
            await this.logInAttemptsModel.create(attemptData);
        } catch (error) {
            console.log('LogInAttemptsService.create, error: ', error);
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    public async update (id: string, dataToUpdate: object) {
        try {
            await this.logInAttemptsModel.updateOne({_id: id}, dataToUpdate);
        } catch (error) {
            console.log('LogInAttemptsService.update, error:', error);
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    public async delete (phone: string) {
        try {
            await this.logInAttemptsModel.deleteOne({phone: phone});
        } catch (error) {
            console.log('LogInAttemptsService.delete, error:', error);
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
