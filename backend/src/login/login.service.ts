import { Injectable, UnauthorizedException } from '@nestjs/common';
import { log } from 'console';
import { last, lastValueFrom } from 'rxjs';
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
    console.log('LoginRequest');
    log('Obteniendo Usuario por RUT');
    const user = await this.usersService.findByRut(rut);
    if (!user) {
      log('Usuario no existe');
      return { success: false, message: 'No se encontró el usuario.' };
    } else {
      log('Usuario encontrado');
      const isValid = await this.usersService.verifyPassword(
        password,
        user.passwordHash,
      );
      if (!isValid) {
        log('Contraseña incorrecta');
        return { success: false, message: 'Contraseña incorrecta' };
      } else {
        log('Contraseña correcta');
        const token = await this.tokenService.generateToken(user);
        this.sessionService.startSession(user.id, token);
        return {
          success: true,
          data: { token: token, uid: user.id, role: user.role },
        };
      }
    }
  }
}

// return this.usersService.findByRut(rut).then(async (user) => {
//   if (!user) {
//     log("Usuario no existe")
//     return { success: false, message: 'User not found' };
//   } else {
//     log(user)
//   }
//   if (this.usersService.verifyPassword(password, user.passwordHash)) {
//     const token = await this.tokenService.generateToken(user);
//     const activeSessionList: Session[] =
//       await this.sessionService.getActiveSessions(user.id);
//     if (activeSessionList.length > 0) {
//       activeSessionList.forEach((session) => {
//         this.sessionService.deleteSession(session);
//       });
//     }
//     this.sessionService.startSession(user.id, token);
//     return { success: true, token: token, uid: user.id, role: -1 };
//   } else {
//     return { success: false, message: 'Invalid password' };
//   }
// });
