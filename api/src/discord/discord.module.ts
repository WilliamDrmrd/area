import { Module } from '@nestjs/common';
import { DiscordController } from './discord.controller';
import { DiscordService } from './discord.service';
import { SendMessage } from './reactions/send-message';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [DiscordController],
  providers: [DiscordService, SendMessage],
  exports: [DiscordService, SendMessage],
  imports: [PrismaModule],
})
export class DiscordModule {}
