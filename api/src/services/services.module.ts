import { Global, Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { GithubModule } from '../github/github.module';
import { EmailJsModule } from '../email-js/email-js.module';
import { Web3isDoingGreatModule } from '../web3is-doing-great/web3is-doing-great.module';
import { WeatherModule } from '../weather/weather.module';
import { DiscordModule } from '../discord/discord.module';
import { SlackModule } from '../slack/slack.module';
import { SpotifyModule } from 'src/spotify/spotify.module';

@Global()
@Module({
  providers: [ServicesService],
  controllers: [ServicesController],
  imports: [
    GithubModule,
    EmailJsModule,
    Web3isDoingGreatModule,
    WeatherModule,
    DiscordModule,
    SlackModule,
    SpotifyModule,
  ],
  exports: [ServicesService],
})
export class ServicesModule {}
