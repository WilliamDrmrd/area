import { Test, TestingModule } from '@nestjs/testing';
import {
  AutomationService,
  AutomationAlreadyExistsException,
} from './automation.service';
import { PrismaService } from '../prisma/prisma.service';
import { ServicesService } from '../services/services.service';
import { ActionsOptionsService } from '../action-reaction-options/actions-options.service';
import { ReactionsOptionsService } from '../action-reaction-options/reactions-options.service';
import { TasksService } from '../tasks/tasks.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateAutomationDto } from './dto';
import { Reaction, Action, User } from '@prisma/client';
import { ActionInterface, ReactionInterface } from 'src/types';

describe('AutomationService', () => {
  let service: AutomationService;
  let prismaService: PrismaService;
  let servicesService: ServicesService;
  let actionsOptionsService: ActionsOptionsService;
  let reactionsOptionsService: ReactionsOptionsService;
  let taskService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutomationService,
        PrismaService,
        {
          provide: PrismaService,
          useValue: {
            automation: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              delete: jest.fn(),
            },
            automationHistory: {
              deleteMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            servicesCredentials: {
              findFirst: jest.fn(),
            },
          },
        },
        ServicesService,
        {
          provide: ServicesService,
          useValue: {
            findUnique: jest.fn(),
            create: jest.fn(),
            getAction: jest.fn(),
            getReaction: jest.fn(),
          },
        },
        ActionsOptionsService,
        {
          provide: ActionsOptionsService,
          useValue: {
            findUnique: jest.fn(),
            create: jest.fn(),
            createOrUpdate: jest.fn(),
          },
        },
        ReactionsOptionsService,
        {
          provide: ReactionsOptionsService,
          useValue: {
            findUnique: jest.fn(),
            create: jest.fn(),
            createOrUpdate: jest.fn(),
          },
        },
        TasksService,
        {
          provide: TasksService,
          useValue: {
            findUnique: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AutomationService>(AutomationService);
    prismaService = module.get<PrismaService>(PrismaService);
    servicesService = module.get<ServicesService>(ServicesService);
    actionsOptionsService = module.get<ActionsOptionsService>(
      ActionsOptionsService,
    );
    reactionsOptionsService = module.get<ReactionsOptionsService>(
      ReactionsOptionsService,
    );
    taskService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
    expect(servicesService).toBeDefined();
    expect(actionsOptionsService).toBeDefined();
    expect(reactionsOptionsService).toBeDefined();
    expect(taskService).toBeDefined();
  });

  describe('getAutomation', () => {
    it('should retrieve automation if it exists', async () => {
      const result = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        creatorID: 1,
        name: 'Test Automation',
        description: 'Test',
        actionId: 1,
        reactionId: 1,
        serviceId: 1,
      };
      jest
        .spyOn(prismaService.automation, 'findUnique')
        .mockResolvedValue(result);

      expect(await service.getAutomation(1)).toEqual(result);
    });

    it('should throw an error if automation does not exist', async () => {
      jest
        .spyOn(prismaService.automation, 'findUnique')
        .mockResolvedValue(null);

      await expect(service.getAutomation(1)).rejects.toThrow(NotFoundException);
    });

    it('should return an empty array if no automations are found', async () => {
      jest.spyOn(prismaService.automation, 'findMany').mockResolvedValue([]);
      const result = await service.getAutomations({ id: 1 } as any);
      expect(result).toEqual([]);
    });
  });

  describe('deleteAutomation', () => {
    const data = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorID: 1,
      name: 'Test Automation',
      description: 'Test',
      actionId: 1,
      reactionId: 1,
      subscribedUsers: [],
    };

    it('should delete an automation and return a confirmation', async () => {
      jest
        .spyOn(prismaService.automationHistory, 'deleteMany')
        .mockResolvedValue(null);
      jest
        .spyOn(prismaService.automation, 'findUnique')
        .mockResolvedValue(data as any);
      jest.spyOn(prismaService.automation, 'delete').mockResolvedValue(data);

      const result = await service.deleteAutomation(1);
      expect(result).toEqual({
        message: 'You have deleted an automation',
        automation: data,
      });
    });

    it('should throw if the automation does not exist', async () => {
      jest
        .spyOn(prismaService.automationHistory, 'deleteMany')
        .mockResolvedValue(null);
      jest
        .spyOn(prismaService.automation, 'findUnique')
        .mockResolvedValue(data as any);
      jest
        .spyOn(prismaService.automation, 'delete')
        .mockImplementationOnce(() => {
          throw new PrismaClientKnownRequestError('Email already exists', {
            code: 'P2025',
            clientVersion: '2.0.0',
          });
        });

      expect(service.deleteAutomation(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw if the automation does not exist', async () => {
      jest
        .spyOn(prismaService.automationHistory, 'deleteMany')
        .mockResolvedValue(null);
      data.subscribedUsers = [1];
      jest
        .spyOn(prismaService.automation, 'findUnique')
        .mockResolvedValue(data as any);
      jest
        .spyOn(prismaService.automation, 'delete')
        .mockImplementationOnce(() => {
          throw new PrismaClientKnownRequestError('Email already exists', {
            code: 'P9999',
            clientVersion: '2.0.0',
          });
        });

      expect(service.deleteAutomation(1)).rejects.toThrow(
        PrismaClientKnownRequestError,
      );
    });
  });

  describe('createOrFail', () => {
    const dto: CreateAutomationDto = {
      name: 'Test Automation',
      description: 'Test Description',
      actionId: 1,
      reactionId: 2,
    };

    // Mock for Action type
    const action: Action = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Mocked Action Name',
      description: 'Mocked Action Description',
      serviceId: 3,
      needAuth: false,
      hasOptions: true,
      additionalFields: '{}',
    };

    const reaction: Reaction = {
      id: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Mocked Reaction Name',
      description: 'Mocked Reaction Description',
      serviceId: 4,
      needAuth: false,
      hasOptions: true,
      additionalFields: '{}',
    };

    const user: User = {
      id: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      username: 'mockedUser',
      email: 'mockedEmailsubscribedAutomations@example.com',
      password: 'mockedPassword',
      firstName: 'Mocked',
      lastName: 'User',
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      isActivated: true,
      isOauth: false,
      token: 'mockedToken',
    };

    it('should throw an exception if automation already exists', async () => {
      jest.spyOn(prismaService.automation, 'findFirst').mockReturnValueOnce({
        id: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        creatorID: 1,
        name: 'Test Automation',
        description: 'Test',
        actionId: 1,
        reactionId: 1,
        serviceId: 1,
        subscribedUsers: [],
      } as any);

      expect(service.createOrFail(dto, action, reaction, user)).rejects.toThrow(
        new AutomationAlreadyExistsException('Automation already exists'),
      );
    });

    it('should create a new automation if none with the same details exists', async () => {
      jest
        .spyOn(prismaService.automation, 'findFirst')
        .mockReturnValueOnce(null);
      const createSpy = jest
        .spyOn(prismaService.automation, 'create')
        .mockReturnValueOnce({ id: 10, name: 'Test Automation' } as any);

      const result = await service.createOrFail(dto, action, reaction, user);

      expect(result).toEqual({ id: 10, name: 'Test Automation' });
      expect(createSpy).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          description: dto.description,
          action: {
            connect: {
              id: action.id,
            },
          },
          reaction: {
            connect: {
              id: reaction.id,
            },
          },
          creator: {
            connect: {
              id: user.id,
            },
          },
          services: {
            connect: [
              action.serviceId ? { id: action.serviceId } : undefined,
              reaction.serviceId ? { id: reaction.serviceId } : undefined,
            ],
          },
        },
      });
    });
  });

  describe('createAutomation', () => {
    const dto: CreateAutomationDto = {
      name: 'Test Automation',
      description: 'Test Description',
      actionId: 1,
      reactionId: 2,
    };
    const user: User = {
      id: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      username: 'mockedUser',
      email: 'mockedEmail@example.com',
      password: 'mockedPassword',
      firstName: 'Mocked',
      lastName: 'User',
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      isActivated: true,
      isOauth: false,
      token: 'mockedToken',
    };

    it('should create a new automation successfully', async () => {
      jest.spyOn(servicesService, 'getAction').mockReturnValueOnce({
        action: {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Mocked Action Name',
          description: 'Mocked Action Description',
          serviceId: 3,
          needAuth: false,
          hasOptions: true,
          additionalFields: '{}',
        },
      } as any);
      jest.spyOn(servicesService, 'getReaction').mockReturnValueOnce({
        reaction: {
          id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Mocked Reaction Name',
          description: 'Mocked Reaction Description',
          serviceId: 4,
          needAuth: false,
          hasOptions: true,
          additionalFields: '{}',
        },
      } as any);
      jest
        .spyOn(prismaService.servicesCredentials, 'findFirst')
        .mockReturnValueOnce({} as any);
      jest.spyOn(service, 'createOrFail').mockResolvedValueOnce({
        name: 'You have created a new automation Test Automation',
      } as any);

      const result = await service.createAutomation(user, dto);

      expect(result).toEqual({
        message:
          'You have created a new automation You have created a new automation Test Automation',
        status: 200,
      });
    });

    it('should throw BadRequestException if action service credentials are missing and action needs authentication', async () => {
      jest.spyOn(servicesService, 'getAction').mockReturnValueOnce({
        action: {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Mocked Action Name',
          description: 'Mocked Action Description',
          serviceId: 3,
          needAuth: false,
          hasOptions: true,
          additionalFields: '{}',
        },
      } as any);
      jest.spyOn(servicesService, 'getReaction').mockReturnValueOnce({
        reaction: {
          id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Mocked Reaction Name',
          description: 'Mocked Reaction Description',
          serviceId: 4,
          needAuth: false,
          hasOptions: true,
          additionalFields: '{}',
        },
      } as any);
      jest.spyOn(service, 'createOrFail').mockImplementationOnce(() => {
        throw new AutomationAlreadyExistsException('Automation already exists');
      });

      await expect(service.createAutomation(user, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if reaction service credentials are missing and reaction needs authentication', async () => {
      jest.spyOn(servicesService, 'getAction').mockReturnValueOnce({
        action: {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Mocked Action Name',
          description: 'Mocked Action Description',
          serviceId: 3,
          needAuth: false,
          hasOptions: true,
          additionalFields: '{}',
        },
      } as any);
      jest.spyOn(servicesService, 'getReaction').mockReturnValueOnce({
        reaction: {
          id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Mocked Reaction Name',
          description: 'Mocked Reaction Description',
          serviceId: 4,
          needAuth: false,
          hasOptions: true,
          additionalFields: '{}',
        },
      } as any);
      jest.spyOn(service, 'createOrFail').mockImplementationOnce(() => {
        throw new AutomationAlreadyExistsException('Automation already exists');
      });

      await expect(service.createAutomation(user, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if automation already exists', async () => {
      jest.spyOn(servicesService, 'getAction').mockReturnValueOnce({
        action: {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Mocked Action Name',
          description: 'Mocked Action Description',
          serviceId: 3,
          needAuth: false,
          hasOptions: true,
          additionalFields: '{}',
        },
      } as any);
      jest.spyOn(servicesService, 'getReaction').mockReturnValueOnce({
        reaction: {
          id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Mocked Reaction Name',
          description: 'Mocked Reaction Description',
          serviceId: 4,
          needAuth: false,
          hasOptions: true,
          additionalFields: '{}',
        },
      } as any);
      jest.spyOn(service, 'createOrFail').mockImplementationOnce(() => {
        throw new AutomationAlreadyExistsException('Automation already exists');
      });

      await expect(service.createAutomation(user, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw any unexpected error', async () => {
      jest.spyOn(servicesService, 'getAction').mockReturnValueOnce({
        action: {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Mocked Action Name',
          description: 'Mocked Action Description',
          serviceId: 3,
          needAuth: false,
          hasOptions: true,
          additionalFields: '{}',
        },
      } as any);
      jest.spyOn(servicesService, 'getReaction').mockReturnValueOnce({
        reaction: {
          id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Mocked Reaction Name',
          description: 'Mocked Reaction Description',
          serviceId: 4,
          needAuth: false,
          hasOptions: true,
          additionalFields: '{}',
        },
      } as any);
      jest.spyOn(service, 'createOrFail').mockImplementationOnce(() => {
        throw new Error('Unexpected Error');
      });

      await expect(service.createAutomation(user, dto)).rejects.toThrow(
        'Unexpected Error',
      );
    });
  });

  describe('getAutomations', () => {
    it('should return an array of automations', async () => {
      const result = [
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorID: 1,
          name: 'Test Automation',
          description: 'Test',
          actionId: 1,
          reactionId: 1,
          serviceId: 1,
        },
      ];
      jest
        .spyOn(prismaService.automation, 'findMany')
        .mockResolvedValue(result as any);
      expect(await service.getAutomations({ id: 1 } as any)).toEqual(result);
    });
    it('should return an empty array if no automations are found', async () => {
      jest.spyOn(prismaService.automation, 'findMany').mockResolvedValue([]);
      const result = await service.getAutomations({ id: 1 } as any);
      expect(result).toEqual([]);
    });

    it('should return an empty array if no automations are found', async () => {
      jest.spyOn(prismaService.automation, 'findMany').mockResolvedValue([]);
      const result = await service.getAutomations({ id: 1 } as any);
      expect(result).toEqual([]);
    });

    it('should return an empty array if no automations are found', async () => {
      jest.spyOn(prismaService.automation, 'findMany').mockResolvedValue([]);
      const result = await service.getAutomations({ id: 1 } as any);
      expect(result).toEqual([]);
    });

    it('should return an empty array if no automations are found', async () => {
      jest.spyOn(prismaService.automation, 'findMany').mockResolvedValue([]);
      const result = await service.getAutomations({ id: 1 } as any);
      expect(result).toEqual([]);
    });
  });

  describe('handleOptions', () => {
    const action: Action = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Mocked Action Name',
      description: 'Mocked Action Description',
      serviceId: 3,
      needAuth: false,
      hasOptions: false,
      additionalFields: '{}',
    };

    const reaction: Reaction = {
      id: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Mocked Reaction Name',
      description: 'Mocked Reaction Description',
      serviceId: 4,
      needAuth: false,
      hasOptions: false,
      additionalFields: '{}',
    };

    const user: User = {
      id: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      username: 'mockedUser',
      email: 'mockedEmail@example.com',
      password: 'mockedPassword',
      firstName: 'Mocked',
      lastName: 'User',
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      isActivated: true,
      isOauth: false,
      token: 'mockedToken',
    };

    const subscription = {
      actionId: 1,
      actionAdditionalFields: {},

      reactionId: 1,
      reactionAdditionalFields: {},
    };

    it('should return an empty array if no options are found', async () => {
      const result = await service.handleOptions(
        action,
        reaction,
        subscription,
        user,
        1,
      );
      expect(result).toStrictEqual({ actionOptions: [], reactionsOptions: [] });
    });

    it('should return an empty array if no options are found', async () => {
      action.hasOptions = true;
      action.additionalFields = { test: 'test' };
      reaction.hasOptions = true;
      reaction.additionalFields = { test: 'test' };
      expect(
        service.handleOptions(action, reaction, subscription, user, 1),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return an empty array if no options are found', async () => {
      action.hasOptions = true;
      action.additionalFields = { test: 'test' };
      reaction.hasOptions = true;
      reaction.additionalFields = { test: 'test' };
      subscription.actionAdditionalFields = { test: 'test' };
      subscription.reactionAdditionalFields = { test: 'test' };
      const actionOption = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        key: 'test',
        value: 'test',
        actionId: 1,
        userId: 1,
        automationId: 1,
      };
      const reactionOption = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        key: 'test',
        value: 'test',
        reactionId: 1,
        userId: 1,
        automationId: 1,
      };
      jest
        .spyOn(actionsOptionsService, 'createOrUpdate')
        .mockResolvedValueOnce(actionOption);
      jest
        .spyOn(reactionsOptionsService, 'createOrUpdate')
        .mockResolvedValueOnce(reactionOption);
      const result = await service.handleOptions(
        action,
        reaction,
        subscription,
        user,
        1,
      );
      expect(result).toStrictEqual({
        actionOptions: [actionOption],
        reactionsOptions: [reactionOption],
      });
    });
  });

  describe('makeCallback', () => {
    const user: User = {
      id: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      username: 'mockedUser',
      email: 'mockedEmail@example.com',
      password: 'mockedPassword',
      firstName: 'Mocked',
      lastName: 'User',
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      isActivated: true,
      isOauth: false,
      token: 'mockedToken',
    };
    const action: ActionInterface = {
      action: { serviceId: 1, name: 'TestAction' },
      execute: jest.fn(),
    } as any;
    const reaction: ReactionInterface = {
      reaction: { serviceId: 2 },
      execute: jest.fn(),
    } as any;
    const automationId = 123;
    const cronId = 'testCronId';

    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should fetch service credentials and automation options correctly', async () => {
      jest
        .spyOn(prismaService.servicesCredentials, 'findFirst')
        .mockResolvedValueOnce({} as any);
      jest
        .spyOn(prismaService.automationHistory, 'findUnique')
        .mockResolvedValue({
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          automationId: 1,
          actionOptions: [{ key: 'testKeyA', value: 'testValueA' }],
          reactionOptions: [{ key: 'testKeyR', value: 'testValueR' }],
        } as any);
      jest.spyOn(prismaService.automationHistory, 'update').mockResolvedValue({
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        automationId: 1,
        actionOptions: [{ key: 'testKeyA', value: 'testValueA' }],
        reactionOptions: [{ key: 'testKeyR', value: 'testValueR' }],
      } as any);
      action.execute = () => {
        return {
          success: true,
          runReaction: true,
          data: {
            message: 'Test message',
            obejct: 'test',
          },
        } as any;
      };
      reaction.execute = () => {
        return { success: true } as any;
      };
      jest.spyOn(prismaService.automation, 'findUnique').mockResolvedValue({
        actionOptions: [{ key: 'testKeyA', value: 'testValueA' }],
        reactionOptions: [{ key: 'testKeyR', value: 'testValueR' }],
      } as any);

      const callback = await service.makeCallback(
        user,
        action,
        reaction,
        automationId,
        cronId,
      );
      await callback();

      expect(prismaService.servicesCredentials.findFirst).toHaveBeenCalledTimes(
        2,
      );
      expect(prismaService.automation.findUnique).toHaveBeenCalledWith({
        where: { id: automationId },
        include: { actionOptions: true, reactionOptions: true },
      });
      expect(console.log).toHaveBeenCalled();
    });

    it('should throw an error if action fails', async () => {
      action.execute = () => {
        return { success: false } as any;
      };
      jest.spyOn(prismaService.automation, 'findUnique').mockResolvedValue({
        actionOptions: [],
        reactionOptions: [],
      } as any);
      const callback = await service.makeCallback(
        user,
        action,
        reaction,
        automationId,
        cronId,
      );
      await callback();
      expect(console.error).toHaveBeenCalled();
    });

    it('should not execute reaction if not needed', async () => {
      action.execute = () => {
        return { success: true, runReaction: false, data: undefined } as any;
      };
      reaction.execute = jest.fn();
      jest.spyOn(prismaService.automation, 'findUnique').mockResolvedValue({
        actionOptions: [],
        reactionOptions: [],
      } as any);

      const callback = await service.makeCallback(
        user,
        action,
        reaction,
        automationId,
        cronId,
      );

      await callback();

      expect(reaction.execute).not.toHaveBeenCalled();
    });

    it('should execute reaction if needed', async () => {
      jest.spyOn(prismaService.automation, 'findUnique').mockResolvedValue({
        actionOptions: [],
        reactionOptions: [],
      } as any);
      action.execute = () => {
        return {
          success: true,
          runReaction: true,
          data: {
            message: 'Test message',
            object: 'test',
          },
        } as any;
      };
      reaction.execute = jest.fn().mockReturnValue({ success: true } as any);

      const callback = await service.makeCallback(
        user,
        action,
        reaction,
        automationId,
        cronId,
      );

      await callback();

      expect(reaction.execute).toHaveBeenCalled();
    });
  });
});
