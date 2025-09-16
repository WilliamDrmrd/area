import { Controller, Post, Body, Get, HttpCode } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@Controller('services/spotify')
export class SpotifyController {
  constructor(private spotifyService: SpotifyService) {}

  @Post('webhooks')
  webhook(@Body() body: any) {
    console.log(body);
  }

  @HttpCode(200)
  @Post('auth')
  auth(@GetUser() user: User, @Body() body: any) {
    return this.spotifyService.applyOAuth(user, body);
  }

  @Get('authData')
  authData(@GetUser() user: User) {
    return this.spotifyService.getAuthData(user);
  }

  @Get('isConnected')
  isConnected(@GetUser() user: User) {
    return this.spotifyService.getIsConnected(user);
  }
}
