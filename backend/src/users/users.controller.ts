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
    const token = headers['authorization'].split(' ')[1];
    const user = await this.tokenService.decodeToken(token);
    console.log('User', user)
    const userObject = await this.usersService.find(user.userId);
    console.log('User', userObject)
    const role = await this.usersService.getRole(user.userId);
    return JSON.stringify({
      ...userObject,
      role,
    });
  }
  @Get('teacher')
  async findTeacher(@Headers() headers: Headers): Promise<string> {
    const token = headers['authorization'].split(' ')[1];
    const user = await this.tokenService.decodeToken(token);
    const teacherObj = await this.usersService.findTeacher(user.userId);
    if (!teacherObj) {
      return JSON.stringify({
        message: 'Teacher not found',
      });
    }
    return JSON.stringify({
      ...teacherObj,
    });
  }
}
