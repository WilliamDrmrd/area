import { Test, TestingModule } from '@nestjs/testing';
import { ReactionsOptionsService } from './reactions-options.service';
import { PrismaService } from '../prisma/prisma.service';
import { User, Reaction } from '@prisma/client';

describe('ReactionsOptionsService', () => {
  let service: ReactionsOptionsService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReactionsOptionsService,
        {
          provide: PrismaService,
          useValue: {
            reactionOptions: {
              create: jest.fn(),
              update: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ReactionsOptionsService>(ReactionsOptionsService);
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as jest.Mocked<PrismaService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a reaction option', async () => {
      const user: User = { id: 1 } as any;
      const reaction: Reaction = { id: 2 } as any;

      jest.spyOn(prisma.reactionOptions, 'create').mockResolvedValue({} as any);

      await service.create('key', 'value', user, reaction);

      expect(prisma.reactionOptions.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a reaction option', async () => {
      jest.spyOn(prisma.reactionOptions, 'update').mockResolvedValue({} as any);

      await service.update(1, 'newValue');

      expect(prisma.reactionOptions.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { value: 'newValue' },
      });
    });
  });

  describe('createOrUpdate', () => {
    const user: User = { id: 1 } as any;
    const reaction: Reaction = { id: 2 } as any;

    it('should update if reaction option exists', async () => {
      jest
        .spyOn(prisma.reactionOptions, 'findFirst')
        .mockResolvedValue({ id: 1 } as any);
      service.update = jest.fn();
      jest.spyOn(service, 'update').mockResolvedValue({} as any);

      await service.createOrUpdate('key', 'value', user, reaction);

      expect(service.update).toHaveBeenCalled();
      expect(prisma.reactionOptions.create).not.toHaveBeenCalled();
    });

    it('should create if reaction option does not exist', async () => {
      jest.spyOn(prisma.reactionOptions, 'findFirst').mockResolvedValue(null);
      service.create = jest.fn();
      jest.spyOn(service, 'create').mockResolvedValue({} as any);
      jest.spyOn(service, 'update').mockResolvedValue({} as any);

      await service.createOrUpdate('key', 'value', user, reaction);

      expect(service.create).toHaveBeenCalled();
      expect(service.update).not.toHaveBeenCalled();
    });
  });

  describe('create with automationId', () => {
    const user: User = { id: 1 } as any;
    const reaction: Reaction = { id: 2 } as any;

    it('should add the Automation connect field if automationId is provided', async () => {
      const automationId = 3;
      jest.spyOn(prisma.reactionOptions, 'create').mockResolvedValue({} as any);

      await service.create('key', 'value', user, reaction, automationId);

      expect(prisma.reactionOptions.create).toHaveBeenCalledWith({
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
      jest.spyOn(prisma.reactionOptions, 'create').mockResolvedValue({} as any);

      await service.create('key', 'value', user, reaction);

      expect(prisma.reactionOptions.create).toHaveBeenCalledWith({
        data: expect.not.objectContaining({
          Automation: expect.anything(),
        }),
      });
    });
  });
});
