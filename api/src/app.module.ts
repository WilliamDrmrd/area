import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AutomationModule } from './automation/automation.module';
import { ServicesModule } from './services/services.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guard';
import { EmailJsModule } from './email-js/email-js.module';
import { DiscordModule } from './discord/discord.module';
import { AppController } from './app.controller';
import { SlackModule } from './slack/slack.module';
import { GithubModule } from './github/github.module';
import { SpotifyModule } from './spotify/spotify.module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    AutomationModule,
    ScheduleModule.forRoot(),
    EmailJsModule,
    DiscordModule,
    SlackModule,
    ServicesModule,
    GithubModule,
    ScheduleModule.forRoot(),
    ServicesModule,
    SpotifyModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
