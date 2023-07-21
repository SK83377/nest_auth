import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { OldRefreshTokensService } from 'src/core/services/oldRefreshTokens/oldRefreshTokens.service';
import { oldRefreshTokensProviders } from '../../database/oldRefreshTokens/oldRefreshTokens.providers';

@Module({
    imports: [DatabaseModule],
    providers: [
        OldRefreshTokensService,
        ...oldRefreshTokensProviders,
    ],
    exports: [OldRefreshTokensService]
})
export class OldRefreshTokensModule {}
