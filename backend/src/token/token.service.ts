import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}
  private readonly privkey = 'meow';
  async decodeToken(
    token: string,
  ): Promise<{ userId: number; username: string }> {
    return await this.jwtService.decode(token);
  }

  async generateToken(user: User) {
    const payload = { userId: user.id, username: user.firstName }; // TODO: cambiar
    return await this.jwtService.signAsync(payload, {
      privateKey: this.privkey,
    });
  }

  async validateToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      // handle the error here
      console.log('Token validation failed:', e);
      return null;
    }
  }
}
