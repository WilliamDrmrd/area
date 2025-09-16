import { Test, TestingModule } from '@nestjs/testing';
import { ActionsOptionsService } from './actions-options.service';
import { PrismaService } from '../prisma/prisma.service';
import { User, Action } from '@prisma/client';

describe('ActionsOptionsService', () => {
  let service: ActionsOptionsService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActionsOptionsService,
        {
          provide: PrismaService,
          useValue: {
            actionOptions: {
              create: jest.fn(),
              update: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ActionsOptionsService>(ActionsOptionsService);
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as jest.Mocked<PrismaService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an action option', async () => {
      const user: User = { id: 1 } as any;
      const action: Action = { id: 2 } as any;

      jest.spyOn(prisma.actionOptions, 'create').mockResolvedValue({} as any);

      await service.create('key', 'value', user, action);

      expect(prisma.actionOptions.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an action option', async () => {
      jest.spyOn(prisma.actionOptions, 'update').mockResolvedValue({} as any);

      await service.update(1, 'newValue');

      expect(prisma.actionOptions.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { value: 'newValue' },
      });
    });
  });

  describe('createOrUpdate', () => {
    const user: User = { id: 1 } as any;
    const action: Action = { id: 2 } as any;

    it('should update if action option exists', async () => {
      jest
        .spyOn(prisma.actionOptions, 'findFirst')
        .mockResolvedValue({ id: 1 } as any);
      service.update = jest.fn();
      jest.spyOn(service, 'update').mockResolvedValue({} as any);

      await service.createOrUpdate('key', 'value', user, action);

      expect(service.update).toHaveBeenCalled();
      expect(prisma.actionOptions.create).not.toHaveBeenCalled();
    });

    it('should create if action option does not exist', async () => {
      jest.spyOn(prisma.actionOptions, 'findFirst').mockResolvedValue(null);
      service.create = jest.fn();
      jest.spyOn(service, 'create').mockResolvedValue({} as any);
      jest.spyOn(service, 'update').mockResolvedValue({} as any);

      await service.createOrUpdate('key', 'value', user, action);

      expect(service.create).toHaveBeenCalled();
      expect(service.update).not.toHaveBeenCalled();
    });
  });

  describe('create with automationId', () => {
    const user: User = { id: 1 } as any;
    const reaction: Action = { id: 2 } as any;

    it('should add the Automation connect field if automationId is provided', async () => {
      const automationId = 3;
      jest.spyOn(prisma.actionOptions, 'create').mockResolvedValue({} as any);

      await service.create('key', 'value', user, reaction, automationId);

      expect(prisma.actionOptions.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          Automation: {
            connect: {
              id: automationId,
            },
          },
        }),
      });
    });

    it('should not add the Automation connect field if automationId is not provided', async () => {
      jest.spyOn(prisma.actionOptions, 'create').mockResolvedValue({} as any);

      await service.create('key', 'value', user, reaction);

      expect(prisma.actionOptions.create).toHaveBeenCalledWith({
        data: expect.not.objectContaining({
          Automation: expect.anything(),
        }),
      });
    });
  });
});
