import { Body, Req, Response, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import RegisterDto from './dto/register.dto';
import LogInDto from './dto/logIn.dto';
import SignInDto from './dto/signIn.dto';
import TwoFAuthReqDto from './dto/twoFAuthReq.dto';
import { VerifyTGDto } from './dto/verifyTG.dto';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { ConfigService } from '@nestjs/config';
import { Md5 } from "md5-typescript";


@Controller('authentication')
export class AuthenticationController {
    constructor(
        private readonly configService: ConfigService,
        private readonly authenticationService: AuthenticationService
    ) {}
 
    @Post('register')
    async register(@Body() registrationData: RegisterDto, @Response() res) {
        const resultRegister = await this.authenticationService.register(registrationData);
        if (resultRegister) res.send('registered');
    }

    @Post('logIn')
    async logIn(@Body() logInData: LogInDto, @Response() res) {
        const resultLogIn = await this.authenticationService.logIn(logInData);
        if (typeof resultLogIn == 'object') {
            console.log('AuthenticationController.logIn, in if');
            await res.cookie(Md5.init(this.configService.get('COOKIE_NAME_ACCESS')), resultLogIn.token);
            await res.cookie(Md5.init(this.configService.get('COOKIE_NAME_REFRESH')), resultLogIn.refreshToken);
            res.send('Success');
        } else res.send(resultLogIn);
    }

    @Post('signIn')
    async signIn(@Body() signInData: SignInDto, @Response({passthrough: true}) res) {
        const tokens = await this.authenticationService.signIn(signInData);
        res.cookie(Md5.init(this.configService.get('COOKIE_NAME_ACCESS')), tokens.token);
        res.cookie(Md5.init(this.configService.get('COOKIE_NAME_REFRESH')), tokens.refreshToken);
        return {msg: "Success"};
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('logOut')
    async logOut(@Req() request, @Response() res) {
        await this.authenticationService.logOut(request.cookies[Md5.init(this.configService.get('COOKIE_NAME_REFRESH'))]);
        await res.cookie(Md5.init(this.configService.get('COOKIE_NAME_ACCESS')), '');
        await res.cookie(Md5.init(this.configService.get('COOKIE_NAME_REFRESH')), '');
        return res.sendStatus(200);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get('getUserId')
    async getUserId (@Req() request) {
        return await this.authenticationService.getUserId(request.cookies[Md5.init(this.configService.get('COOKIE_NAME_REFRESH'))]);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('twoFAuthReq')
    async twoFAuthReq (@Body() innerData: TwoFAuthReqDto, @Response() res) {
        const resultTwoFAuthReq = await this.authenticationService.twoFAuthReq(innerData.userId);
        res.json(resultTwoFAuthReq);
    }
    
    @Post('verifyTG')
    async verifyTG (@Body() verifyTGData: VerifyTGDto, @Response() res) {
        const resultVerifytg =  await this.authenticationService.verifyTG(verifyTGData);
        res.send(resultVerifytg);
    }
}
