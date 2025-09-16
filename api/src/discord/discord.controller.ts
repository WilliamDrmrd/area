import { Controller, Post, Body, Get } from '@nestjs/common';
import { SendMessage } from './reactions/send-message';

@Controller('discord')
export class DiscordController {
  constructor(private sendMessage: SendMessage) {}

  @Post('webhooks')
  webhook(@Body() body: any) {
    console.log(body);
  }

  @Get('auth')
  auth() {
    console.log('auth');
  }

  @Get('send-message')
  sendmessage() {
    this.sendMessage.sendMessage(
      { message: 'message de test' },
      'https://discord.com/api/webhooks/1161044971172921354/qAKF6QPDkkT5wAC5K8s0jTuHjyHC9yAXqO9pAqh4PZ6D5b-Ijn4bFug5PrBq-F97Vb9k',
    );
  }
}
