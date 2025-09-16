import { Module } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { AutomationController } from './automation.controller';
import { ActionReactionOptionsModule } from '../action-reaction-options/action-reaction-options.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  providers: [AutomationService],
  controllers: [AutomationController],
  imports: [ActionReactionOptionsModule, TasksModule],
})
export class AutomationModule {}
