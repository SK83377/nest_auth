import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as randomToken from 'rand-token';

// @for creating tokens and saving refresh token to DB.
@Injectable()
export class TokenService {
    private userId: string;
    private token: string;
    private rTData: rTDataInterface;
    constructor (
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}
    public async createNSaveTokens (userId: string) {
        this.userId = userId;
        await this.createJwtToken();
        await this.createRefreshToken();
        await this.usersService.updateRefreshToken(this.userId, this.rTData);
        return {token: this.token, refreshToken: this.rTData.refreshToken};
    }
    private async createJwtToken () {
        const userIdObj: UserIdObjInterface = await {userId: this.userId};
        this.token = await this.jwtService.signAsync(userIdObj, {secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
          });
    }
    private async createRefreshToken () {
        this.rTData = await {
            refreshToken: randomToken.generate(16),
            refreshTokenIssued: Math.round(new Date().getTime() / 1000) + Number(this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'))
        };
    }
}
