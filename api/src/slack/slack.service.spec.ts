import { Test, TestingModule } from '@nestjs/testing';
import { SlackService } from './slack.service';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessage } from './reactions/send-message';

describe('SlackService', () => {
  let service: SlackService;
  let mockPrismaService: Partial<PrismaService>;
  let mockSendMessage: Partial<SendMessage>;

  beforeEach(async () => {
    mockSendMessage = {
      saveReaction: jest.fn().mockResolvedValue(1),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlackService,
        {
          provide: PrismaService,
          useValue: {
            service: {
              upsert: jest.fn(),
            },
          },
        },
        {
          provide: SendMessage,
          useValue: mockSendMessage,
        },
      ],
    }).compile();

    service = module.get<SlackService>(SlackService);
    mockPrismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockPrismaService).toBeDefined();
    expect(mockSendMessage).toBeDefined();
  });

  describe('saveService', () => {
    const log = console.log;
    beforeAll(() => {
      console.log = jest.fn();
    });
    afterAll(() => {
      console.log = log;
    });
    it('should call upsert and save the service', async () => {
      const spy = jest
        .spyOn(mockPrismaService.service, 'upsert')
        .mockResolvedValue({} as any);
      await service.saveService();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('saveActions', () => {
    it('should save actions', async () => {
      const result = await service.saveActions();
      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(0);
    });
  });

  describe('loadActions', () => {
    it('should return loaded actions', () => {
      const actions = service.loadActions();
      expect(actions).toBeInstanceOf(Map);
      expect(actions.size).toBe(0);
    });
  });

  describe('saveReactions', () => {
    const log = console.log;
    beforeAll(() => {
      console.log = jest.fn();
    });
    afterAll(() => {
      console.log = log;
    });
    it('should save reactions', async () => {
      service.slack = { id: 1 } as any;
      const result = await service.saveReactions();
      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(1);
    });
  });

  describe('loadReactions', () => {
    it('should return loaded reactions', () => {
      const reactions = service.loadReactions();
      expect(reactions).toBeInstanceOf(Map);
      expect(reactions.size).toBe(0);
    });
  });

  describe('authenticate', () => {
    it('should return true', () => {
      const isAuthenticated = service.authenticate();
      expect(isAuthenticated).toBeTruthy();
    });
  });
});
