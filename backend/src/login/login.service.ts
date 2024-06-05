import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Session } from 'src/session/session.entity';
import { SessionService } from 'src/session/session.service';
import { TokenService } from 'src/token/token.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LoginService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private sessionService: SessionService,
  ) {}

  async getUserFromToken(token: string): Promise<User> {
    try {
      const decoded = await this.tokenService.decodeToken(token);
      return this.usersService.find(decoded.userId);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async login(rut: number, password: string): Promise<object> {
    return this.usersService.findByRut(rut).then(async (user) => {
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      if (this.usersService.verifyPassword(password, user.passwordHash)) {
        const token = await this.tokenService.generateToken(user);
        const activeSessionList: Session[] =
          await this.sessionService.getActiveSessions(user.id);
        if (activeSessionList.length > 0) {
          activeSessionList.forEach((session) => {
            this.sessionService.deleteSession(session);
          });
        }
        this.sessionService.startSession(user.id, token);
        return { success: true, token: token, uid: user.id, role: -1 };
      } else {
        return { success: false, message: 'Invalid password' };
      }
    });
  }
}
