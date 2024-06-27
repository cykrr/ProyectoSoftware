import { Controller, Get, Headers } from '@nestjs/common';
import { UsersService } from './users.service';
import { TokenService } from 'src/token/token.service';

@Controller('user')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  @Get('')
  async find(@Headers() headers: Headers): Promise<string> {
    const token = headers['authorization']?.split(' ')[1];
    console.log('[UserController] Token', token);
    const user = await this.tokenService.decodeToken(token);
    if (!user) {
      return null;
    }
    // console.log('User', user)
    const userObject = await this.usersService.find(user.userId);
    // console.log('User', userObject)
    const role = await this.usersService.getRole(user.userId);
    return JSON.stringify({
      ...userObject,
      role,
    });
  }
  @Get('teacher')
  async findTeacher(@Headers() headers: Headers): Promise<object> {
    const token = headers['authorization']?.split(' ')[1];
    console.log('[UserController] Token', token);
    const user = await this.tokenService.decodeToken(token);
    console.log('[UserController] User', user);
    const teacherObj = await this.usersService.findTeacher(user?.userId);
    if (!teacherObj) {
      return {
        success: false,
        message: 'La sesión expiró.',
      };
    }
    return {
      success: true,
      message: 'Teacher found',
      data: teacherObj,
    };
  }
}
