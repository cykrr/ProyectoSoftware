import { Body, Controller, Post } from '@nestjs/common';
import { TokenService } from 'src/token/token.service';
import { LoginService } from './login.service';
import { LoginDto } from './login.dto';

@Controller('login')
export class LoginController {
  constructor(
    private loginService: LoginService,
    private tokenService: TokenService,
  ) {}

  @Post()
  async login(@Body() data: LoginDto): Promise<object> {
    const rut = data.rut;
    const password = data.password;

    if (!rut || !password) {
      return { success: false, message: 'Invalid data' };
    }

    const d = await this.loginService.login(rut, password);
    return d;
  }
}
