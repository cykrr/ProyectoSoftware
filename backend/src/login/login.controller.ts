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
  async login(@Body() data: LoginDto): Promise<string> {
    console.log("post")
    const rut = data.rut;
    const password = data.password;
    if (!rut || !password) {
      return JSON.stringify({ success: false, message: 'Invalid data' });
    }
    return JSON.stringify(await this.loginService.login(rut, password));
  }
}
