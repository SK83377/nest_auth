import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from 'src/core/services/tokenService/tokenService';
import { DataValidateService } from 'src/core/services/dataValidateService/dataValidate.service';


@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRATION_TIME'),
                  },
            }),
        }),
    ],
    providers: [
        TokenService,
        DataValidateService
    ],
    exports: [
        TokenService
    ]
})
export class TokenModule {
}
