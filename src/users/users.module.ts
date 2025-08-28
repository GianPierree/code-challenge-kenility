import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { CommonService } from 'src/common/common.service';
import { LoginService } from 'src/login/login.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    CommonService,
    LoginService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
