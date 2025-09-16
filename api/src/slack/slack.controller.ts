import { Controller, Post, Body, Get } from '@nestjs/common';
import { SendMessage } from './reactions/send-message';

@Controller('slack')
export class SlackController {
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
      'Bienvenue sur Slack !',
      'https://hooks.slack.com/services/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',
    );
  }
}
