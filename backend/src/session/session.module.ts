import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { SessionService } from './session.service';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, User])],
  providers: [SessionService],
  exports: [TypeOrmModule.forFeature([Session, User])],
})
export class SessionModule {}
