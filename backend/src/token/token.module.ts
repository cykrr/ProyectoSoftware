import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [TokenService],
  imports: [JwtModule],
})
export class TokenModule {
  constructor(private tokenService: TokenService) {
    console.log('TokenModule was created');
  }
}
