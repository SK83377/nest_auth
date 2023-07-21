import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { UsersService } from 'src/core/services/users/users.service';
import { usersProviders } from '../../database/users/users.providers';

@Module({
    imports: [DatabaseModule],
    providers: [
        UsersService,
        ...usersProviders,
    ],
    exports: [UsersService]
})
export class UsersModule {}