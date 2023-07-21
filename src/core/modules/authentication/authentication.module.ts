import { Module } from '@nestjs/common';
import { AuthenticationController } from '../../controllers/authentication/authentication.controller';
import { UsersModule } from 'src/core/modules/users/users.module';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../../services/authentication/jwt.strategy';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { LogInAttemptsModule } from '../logInAttempts/logInAttempts.module';
import { OldRefreshTokensModule } from '../oldRefreshTokens/oldRefreshTokens.module';
import { DataValidateService } from 'src/core/services/dataValidateService/dataValidate.service';
import { TokenService } from 'src/core/services/tokenService/tokenService';
import { TwoFAuthReqsModule } from '../twoFAuthReqs/twoFAuthReqs.module';


@Module({
    imports: [
        UsersModule,
        LogInAttemptsModule,
        OldRefreshTokensModule,
        PassportModule,
        ConfigModule,
        TwoFAuthReqsModule
    ],
    controllers: [AuthenticationController],
    providers: [
        {
            provide: 'EV_SELLER_TG_BOT_MICROSERVICE',
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ClientProxyFactory.create({
              transport: Transport.RMQ,
              options: {
                urls: [
                  `amqp://${configService.get('RABBITMQ_USER')}:${configService.get('RABBITMQ_PASSWORD')}@${configService.get('RABBIT_MQ_HOST')}:${configService.get('RABBIT_MQ_PORT')}`,
                ],
                queue: 'send_code_ms_queue',
                replyQueue: 'send_code_ms_queue_reply',
                noAck: false,
                queueOptions: {
                  durable: true,
                }
              },
            }),
        },
        AuthenticationService,
        DataValidateService,
        TokenService,
        JwtStrategy,
        JwtService
    ],
    exports: [
        PassportModule,
        JwtStrategy
    ]
})
export class AuthenticationModule {}
