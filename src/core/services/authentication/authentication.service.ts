import { Injectable, Inject, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LogInAttemptsService } from '../logInAttempts/logInAttempts.service';
import { DataValidateService } from '../dataValidateService/dataValidate.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../../controllers/authentication/dto/register.dto';
import { LogInDto } from '../../controllers/authentication/dto/logIn.dto';
import { SignInDto } from '../../controllers/authentication/dto/signIn.dto';
import VerifyTGDto from 'src/core/controllers/authentication/dto/verifyTG.dto';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { TokenService } from 'src/core/services/tokenService/tokenService';
import { TwoFAuthReqsService } from '../twoFAuthReqs/twoFAuthReqs.service';

@Injectable()
export class AuthenticationService {
    constructor(
        @Inject('EV_SELLER_TG_BOT_MICROSERVICE') private client: ClientProxy,
        private readonly configService: ConfigService,
        private readonly dataValidateService: DataValidateService,
        private readonly usersService: UsersService,
        private readonly logInAttemptsService: LogInAttemptsService,
        private readonly tokenService: TokenService,
        private readonly twoFAuthReqsService: TwoFAuthReqsService
    ) {}
    // @Method is used for registration new user
    public async register (registrationData: RegisterDto) {
        await this.dataValidateService.checkEmail(registrationData.email);
        const hashedPassword = await this.hashPass(registrationData.password);
        return await this.usersService.create({
            ...registrationData,
            password: hashedPassword
        });
    }
    // @Method for signing in user. If user didn't add two factor authentication, it will only checks, login and password. Otherwise, it will  generate the dynamic code(with expiration timing), save it to database and send to user's telegram, which user will enter in specific input and it will be sent to be verified by API 'signIn'. Also responds for  fixing user's log in attempts and prevents more then 3 during 24h. 
    public async logIn (logInData: LogInDto) {
        await this.dataValidateService.checkData(logInData);
        const user = await this.usersService.getByPhone(logInData.phone);
        await this.verifyPassword(logInData.password, user.password);
        if (!user.chatId) {
            return await this.tokenService.createNSaveTokens(user.id);
        }
        const logInAttempt = await this.logInAttemptsService.getByPhone(logInData.phone);
        const currentTime = await Math.round(Date.now()/1000);
        const logInAttemptsExpTime = Number(this.configService.get('LOG_IN_ATTEMPTS_EXP_TIME'));
        const code = await this.genCode();
        await this.sendCodeToMS(user.chatId, code);
        if (!logInAttempt) {
            const attemptData = await {
                phone: logInData.phone,
                loginAttempts: 1,
                fATime: currentTime,
                code: code,
                codeTime: currentTime
            };
            await this.logInAttemptsService.create(attemptData);
        } else if (logInAttempt.loginAttempts == 3 && logInAttempt.fATime-currentTime <= logInAttemptsExpTime) {
             throw new HttpException('Log in attempts limit', HttpStatus.BAD_REQUEST);
        } else if (logInAttempt.loginAttempts < 3) {
            const updateAttemptData = await {
                loginAttempts: logInAttempt.loginAttempts+1,
                code: code,
                codeTime: currentTime
            };
            await this.logInAttemptsService.update(logInAttempt._id, updateAttemptData);
        } else if (logInAttempt.loginAttempts == 3 && logInAttempt.fATime-currentTime > logInAttemptsExpTime) {
            const updateAttemptData = await {
                loginAttempts: 1,
                fATime: currentTime,
                code: code,
                codeTime: currentTime
            };
            await this.logInAttemptsService.update(logInAttempt._id, updateAttemptData);
        }
        return 'code sent';
    }
    // @verifies 2factor authentication code
    public async signIn (signInData: SignInDto) {
        await this.dataValidateService.checkData(signInData);
        const logInAttempt = await this.logInAttemptsService.getByPhone(signInData.phone);
        if (!logInAttempt || signInData.code != logInAttempt.code) throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        const currentTime = await Math.round(Date.now()/1000);
        const codeExpTime = await logInAttempt.codeTime + Number(this.configService.get('LOG_IN_CODE_EXP_TIME'));
        if (currentTime > codeExpTime) throw new HttpException('Code expired', HttpStatus.BAD_REQUEST);
        const user = await this.usersService.getByPhone(signInData.phone);
        return await this.tokenService.createNSaveTokens(user.id);
    }
    public async getUserId (refreshToken: string) {
        const user = await this.usersService.getByToken(refreshToken);
        if (!user) throw new BadRequestException('invalid refresh token');
        return {userId: user.id};
    }
    // @Creates code(with timing expiration), save it to database and return in response, with telegram bot link. Then user will send it to bot for being verified.
    public async twoFAuthReq (userId: string) {
        const twoFAuthReqsData = await {
            userId: userId,
            code: await this.genCode(),
            codeExpTime: await Math.round(Date.now()/1000) + Number(process.env.TWO_F_AUTH_REQ_CODE_EXP_TIME)
        }
        await this.twoFAuthReqsService.create(twoFAuthReqsData);
        return {tgBotLink: `https://t.me/${this.configService.get('TG_BOT_NAME')}`, code: twoFAuthReqsData.code};
    }
    // @Verifies and save telegram chat(user with bot) for future 2f authentication, by sending codes to this chat
    public async verifyTG (verifyTGData: VerifyTGDto) {
        const twoFAuthReqsResult = await this.twoFAuthReqsService.getByCode(verifyTGData.code);
        if (!twoFAuthReqsResult) {
            return 'Wrong code';
        }
        await this.twoFAuthReqsService.delete(verifyTGData.code);
        if (twoFAuthReqsResult.codeExpTime < Math.round(Date.now()/1000)) {
            return 'Code expired';
        } else {
            const resultUpdateChatId = await this.usersService.updateChatId(twoFAuthReqsResult.userId, verifyTGData.chatId);
            if (resultUpdateChatId) {
                return '2FAuth added';
            } else {
                return 'Something went wrong, try else on the web-site';
            }
        }
    }
    // @for logout user
    public async logOut (refreshToken: string) {
        const user = await this.usersService.getByToken(refreshToken);
        if (!user) throw new BadRequestException('invalid refresh token');
        await this.logInAttemptsService.delete(user.phone);
        await this.usersService.updateRefreshToken(user.id, null);
    }
    private async genCode (): Promise<string> {
        return await Math.random().toString(36).substring(2,10);
    }
    private async hashPass (password: string) {
        try {
            const hashedPass = await bcrypt.hash(password, 14);
            return hashedPass;
        } catch (err) {
            console.log(err);
        }
    }
    private async verifyPassword (plainTextPassword: string, hashedPassword: string) {
        if (!await bcrypt.compare(plainTextPassword,hashedPassword)) throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
    // @sends code to microservice, which is intended for connection with telegram bot
    private async sendCodeToMS (chatId: string, code: string) {
        try {
            const sendResult = await this.client.send('send', {chatId: chatId, code: code}).toPromise();
            console.log(sendResult);
        } catch (error) {
            console.log(error);
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
