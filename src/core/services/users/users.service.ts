import { Model, Types } from 'mongoose';
import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { UsersDto } from './users.dto';
import { Users } from '../../database/users/users.interface';
import { USERS_MODEL } from '../../database/constants';
import { mongoErrorCode } from '../../database/mongoErrorCodes.enum';

// @DB requests for 'users' collection.
@Injectable()
export class UsersService {
    constructor(
        @Inject(USERS_MODEL)
        private usersModel: Model<Users>,
    ) {}
    async getById (id: string) {
        try {
            return await this.usersModel.findOne({_id: id});
        } catch (error) {
            console.log('UsersService.getById, error: ', error);
            return false;
        }
    }
    async getByPhone (phone: string) {
        try {
            const user = await this.usersModel.findOne({phone: phone});
            if (user) return user;
            else throw new HttpException('Wrong data', HttpStatus.NOT_FOUND);
        } catch (error) {
            console.log('UsersService.getByPhoneNPass, error: ', error);
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getByToken (token: string) {
        try {
            return await this.usersModel.findOne({"refreshTokenData.refreshToken": token});
        } catch (error) {
            console.log('UsersService.getByToken, error: ', error);
        }
    }
    // @method creates user and checks whether it was registered before
    async create (userData: UsersDto) {
        try {
            const newUser = await this.usersModel.create(userData);
            return newUser;
        } catch (error) {
            console.log('UsersService.create in catch, error: ', error);
            if (error?.code === mongoErrorCode.UniqueViolation) {
                throw new HttpException('User with that email or phone already exists', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateRefreshToken (userId: string, newRefreshToken: object) {
        try {
            const id = typeof userId=="string" ? new Types.ObjectId(userId) : userId;
            const user = await this.usersModel.findOneAndUpdate({_id: id}, {refreshTokenData: newRefreshToken},{new: true});
        } catch (error) {
            console.log('UsersService.updateRefreshToken, error: ', error);
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateChatId (userId: string, chatId: string) {
        try {
            const updateResult = await this.usersModel.findOneAndUpdate({_id: new Types.ObjectId(userId)}, {chatId: chatId},{new: true});
            return true;
        } catch (error) {
            console.log('UsersService.updateRefreshToken, error: ', error);
            return false;
        }
    }
}
