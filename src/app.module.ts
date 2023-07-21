import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './core/modules/authentication/authentication.module';

@Module({
  imports: [
    AuthenticationModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    })
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
