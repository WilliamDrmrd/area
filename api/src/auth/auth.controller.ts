import { Controller, Post, Get, Body, HttpCode, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { LoginDto, RegisterDto, RegisterOauthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('oauth/login')
  oauthLogin(@Body() dto: RegisterOauthDto) {
    return this.authService.oauthLogin(dto);
  }

  @HttpCode(200)
  @Public()
  @Post('login')
  signIn(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('register')
  signUp(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('logout')
  signOut() {
    return 'heheheheh';
  }

  @Public()
  @Get(':uuid/activate')
  activateAccount(@Param('uuid') uuid: string) {
    console.log('éghfjkhdfiousdvhbioyu fyu');
    return this.authService.activateAccount(uuid);
  }
}
