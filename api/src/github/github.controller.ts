import { Controller, Post, Body, Get, HttpCode } from '@nestjs/common';
import { GithubService } from './github.service';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@Controller('services/github')
export class GithubController {
  constructor(private githubService: GithubService) {}

  @Post('webhooks')
  webhook(@Body() body: any) {
    console.log(body);
  }

  @HttpCode(200)
  @Post('auth')
  auth(@GetUser() user: User, @Body() body: any) {
    return this.githubService.applyOAuth(user, body);
  }

  @Get('authData')
  authData(@GetUser() user: User) {
    return this.githubService.getAuthData(user);
  }

  @Get('isConnected')
  isConnected(@GetUser() user: User) {
    return this.githubService.getIsConnected(user);
  }
}
