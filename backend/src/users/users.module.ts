import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Student, Teacher } from './user.entity';
import { UsersController } from './users.controller';
import { TokenService } from 'src/token/token.service';
import { JwtService } from '@nestjs/jwt';
import { TokenModule } from 'src/token/token.module';
@Module({
  imports: [TokenModule, TypeOrmModule.forFeature([User, Teacher, Student])],
  providers: [UsersService, JwtService, TokenService],
  controllers: [UsersController],
  exports: [
    TokenService,
    UsersService,
    TypeOrmModule.forFeature([User, Teacher, Student]),
  ],
})
export class UsersModule {
  constructor(private usersService: UsersService) {}
}
