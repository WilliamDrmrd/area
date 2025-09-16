import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

jest.mock('cron', () => {
  return {
    CronJob: jest.fn().mockImplementation(() => {
      return {
        start: jest.fn(),
      };
    }),
  };
});

describe('TasksService', () => {
  let tasksService: TasksService;
  let mockSchedulerRegistry: Partial<SchedulerRegistry>;

  beforeEach(async () => {
    mockSchedulerRegistry = {
      deleteCronJob: jest.fn(),
      addCronJob: jest.fn(),
      getCronJob: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: SchedulerRegistry,
          useValue: mockSchedulerRegistry,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
  });

  describe('cronId', () => {
    it('should generate a cronId based on automationId and userId', () => {
      const result = tasksService.cronId(1, 42);
      expect(result).toEqual('1-42');
    });
  });

  describe('addCron', () => {
    const log = console.log;

    beforeAll(() => {
      console.log = jest.fn();
    });

    afterAll(() => {
      console.log = log;
    });

    it('should add a cron job to the scheduler registry', () => {
      const automationId = 1;
      const userId = 42;
      const timer = '* * * * *';
      const job = jest.fn();

      tasksService.addCron(automationId, userId, timer, job);

      expect(mockSchedulerRegistry.deleteCronJob).toBeCalledWith('1-42');
      expect(mockSchedulerRegistry.addCronJob).toBeCalled();
      expect(CronJob).toBeCalledWith(timer, job);

      expect(console.log).toBeCalledWith('added cron 1-42');
    });
  });

  describe('removeCron', () => {
    it('should remove a cron job from the scheduler registry', () => {
      const automationId = 1;
      const userId = 42;

      tasksService.removeCron(automationId, userId);

      expect(mockSchedulerRegistry.deleteCronJob).toBeCalledWith('1-42');
    });
  });
});
