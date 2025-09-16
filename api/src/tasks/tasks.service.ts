import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TasksService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  cronId(automationId: number, userId: number): string {
    return `${automationId}-${userId}`;
  }

  addCron(
    automationId: number,
    userId: number,
    timer: string,
    job: () => void,
  ) {
    const id = this.cronId(automationId, userId);
    try {
      this.schedulerRegistry.deleteCronJob(id);
      console.log(`deleted cron ${id}`);
    } catch (e) {}
    const cron = new CronJob(timer, job);
    this.schedulerRegistry.addCronJob(id, cron);
    cron.start();
    console.log(`added cron ${automationId}-${userId}`);
  }

  removeCron(automationId: number, userId: number) {
    this.schedulerRegistry.deleteCronJob(this.cronId(automationId, userId));
  }
}
