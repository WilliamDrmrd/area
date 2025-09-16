import { Controller, Get, Req } from '@nestjs/common';
import { Public } from './auth/decorator/public.decorator';
import { ServicesService } from './services/services.service';
import { Request } from 'express';

@Controller('')
export class AppController {
  constructor(private services: ServicesService) {}

  @Public()
  @Get()
  getRoot() {
    return {
      message: 'Welcome to the API!',
      status: 200,
    };
  }

  @Public()
  @Get('client.apk')
  getApk() {
    return {
      message: 'Download the latest version of the APK!',
      status: 200,
    };
  }

  @Public()
  @Get('about.json')
  async getAbout(@Req() req: Request) {
    const ip = req.ip.startsWith('::ffff:') ? req.ip.substring(7) : req.ip;

    return {
      server: {
        client: { host: ip },
        current_time: Math.floor(Date.now() / 1000),
        services: await this.services.getAboutServices(),
      },
    };
  }
}
