import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { LogInAttemptsService } from 'src/core/services/logInAttempts/logInAttempts.service';
import { logInAttemptsProviders } from 'src/core/database/logInAttempts/logInAttempts.providers';

@Module({
    imports: [DatabaseModule],
    providers: [
        LogInAttemptsService,
        ...logInAttemptsProviders,
    ],
    exports: [LogInAttemptsService]
})
export class LogInAttemptsModule {}
