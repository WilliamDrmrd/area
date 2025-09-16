import { Module } from '@nestjs/common';
import { ActionsOptionsService } from './actions-options.service';
import { ReactionsOptionsService } from './reactions-options.service';

@Module({
  providers: [ActionsOptionsService, ReactionsOptionsService],
  exports: [ActionsOptionsService, ReactionsOptionsService],
})
export class ActionReactionOptionsModule {}
