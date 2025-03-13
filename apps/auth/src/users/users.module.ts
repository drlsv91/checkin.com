import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule, LoggerModule } from '@app/common';
import { UserDocument, userSchema } from './models/user.schema';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: userSchema },
    ]),
    LoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
})
export class UsersModule {}
