import { Module } from '@nestjs/common';
import { EmailJsController } from './email-js.controller';
import { EmailJsService } from './email-js.service';
import { SendEmail } from './reactions/send-email';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [EmailJsController],
  providers: [EmailJsService, SendEmail],
  exports: [EmailJsService, SendEmail],
  imports: [PrismaModule],
})
export class EmailJsModule {}
