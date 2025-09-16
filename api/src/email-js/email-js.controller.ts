import { Controller, Post, Body, Get } from '@nestjs/common';
import { SendEmail } from './reactions/send-email';

@Controller('email-js')
export class EmailJsController {
  constructor(private sendEmail: SendEmail) {}

  @Post('webhooks')
  webhook(@Body() body: any) {
    console.log(body);
  }

  @Get('auth')
  auth() {
    console.log('auth');
  }

  @Get('send-email')
  sendemail() {
    this.sendEmail.sendEmail(
      'test',
      'prénom',
      'nom',
      'florian.bower@gmail.com',
      'message',
    );
  }
}
