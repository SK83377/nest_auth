import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { Md5 } from "md5-typescript";
import { DataValidateService } from '../dataValidateService/dataValidate.service';
import { OldRefreshTokensService } from "../oldRefreshTokens/oldRefreshTokens.service";
import { TokenService } from 'src/core/services/tokenService/tokenService';

// @checks tokens for expiration time. First checks access token and goes further only when it is expired. Then if refresh token is not expired changes both. Refresh token saves to db.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private currentTime: number;
    private cookies: any;
    private res: any;
    constructor(
        private oldRefreshTokensService: OldRefreshTokensService,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly tokenService: TokenService,
        private readonly dataValidateService: DataValidateService
    ) {
        super({
            ignoreExpiration: true,
            secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                this.cookies = request.cookies;
                this.res = request.res;
                const accessTokenData = request?.cookies[Md5.init(configService.get('COOKIE_NAME_ACCESS'))];
                if(!accessTokenData) {
                    return null;
                }
                return accessTokenData;
            }])
        });
    }
    private async validate (tokenData: any) {
        if(tokenData === null){
            throw new UnauthorizedException();
        }
        this.currentTime = Math.round(new Date().getTime() / 1000);
        if (tokenData.exp >= this.currentTime) {
            return 'ok';
        }
        await this.dataValidateService.checkData(this.cookies[Md5.init(this.configService.get('COOKIE_NAME_REFRESH'))])
        const refreshToken = this.cookies[Md5.init(this.configService.get('COOKIE_NAME_REFRESH'))];
        if(!refreshToken) {
            throw new BadRequestException('invalid refresh token');
        }
        const oldRefreshTokenData = await this.oldRefreshTokensService.getByRefreshToken(refreshToken);
        if (oldRefreshTokenData) {
            await this.usersService.updateRefreshToken(oldRefreshTokenData.userId, null);
            await this.res.cookie(Md5.init(this.configService.get('COOKIE_NAME_ACCESS')), '');
            await this.res.cookie(Md5.init(this.configService.get('COOKIE_NAME_REFRESH')), '');
            throw new BadRequestException('invalid refresh token');
        }
        const user = await this.usersService.getByToken(refreshToken);
        if (!user) throw new BadRequestException('invalid refresh token');
        if (this.currentTime > user.refreshTokenData.refreshTokenIssued) throw new BadRequestException('refrersh token expired');
        await this.oldRefreshTokensService.create({userId: user._id.toString(), oldRefreshToken: refreshToken});
        const tokens = await this.tokenService.createNSaveTokens(user._id);
        await this.res.cookie(Md5.init(this.configService.get('COOKIE_NAME_ACCESS')), tokens.token);
        await this.res.cookie(Md5.init(this.configService.get('COOKIE_NAME_REFRESH')), tokens.refreshToken);
        return 'ok';
    }
}