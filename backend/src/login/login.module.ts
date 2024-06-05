import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { TokenService } from 'src/token/token.service';
import { JwtModule } from '@nestjs/jwt';
import { LoginService } from './login.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student, Teacher, User } from 'src/users/user.entity';
import { SessionService } from 'src/session/session.service';
import { SessionModule } from 'src/session/session.module';
import { Session } from 'src/session/session.entity';
import { Grade } from 'src/grade/grade.entity';

@Module({
  controllers: [LoginController],
  providers: [TokenService, LoginService, UsersService, SessionService],
  imports: [
    UsersModule,
    JwtModule,
    TypeOrmModule.forFeature([User, Teacher, Student, Session, Grade]),
    SessionModule,
  ],
})
export class LoginModule {}
