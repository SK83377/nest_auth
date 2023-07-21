import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { TwoFAuthReqsService } from 'src/core/services/twoFAuthReqs/twoFAuthReqs.service';
import { twoFAuthReqsProviders } from 'src/core/database/twoFAuthReqs/twoFAuthReqs.providers';

@Module({
    imports: [DatabaseModule],
    providers: [
        TwoFAuthReqsService,
        ...twoFAuthReqsProviders,
    ],
    exports: [TwoFAuthReqsService]
})
export class TwoFAuthReqsModule {}
