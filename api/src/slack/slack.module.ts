import { Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';
import { SendMessage } from './reactions/send-message';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [SlackController],
  providers: [SlackService, SendMessage],
  exports: [SlackService, SendMessage],
  imports: [PrismaModule],
})
export class SlackModule {}
