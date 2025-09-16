import { Test, TestingModule } from '@nestjs/testing';
import { DiscordService } from './discord.service';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessage } from './reactions/send-message';

describe('DiscordService', () => {
  let service: DiscordService;
  let mockPrismaService: Partial<PrismaService>;
  let mockSendMessage: Partial<SendMessage>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscordService,
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
          useValue: {
            saveReaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DiscordService>(DiscordService);
    mockPrismaService = module.get<PrismaService>(PrismaService);
    mockSendMessage = module.get<SendMessage>(SendMessage);
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

  describe('saveReactions', () => {
    const log = console.log;
    beforeAll(() => {
      console.log = jest.fn();
    });
    afterAll(() => {
      console.log = log;
    });
    it('should save reactions', async () => {
      service.discord = { id: 1 } as any;
      const result = await service.saveReactions();
      expect(mockSendMessage.saveReaction).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(1);
    });
  });

  describe('authenticate', () => {
    it('should return true', () => {
      const result = service.authenticate();
      expect(result).toBe(true);
    });
  });

  describe('saveActions', () => {
    it('should return registered actions', async () => {
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

  describe('loadReactions', () => {
    it('should return loaded reactions', () => {
      const reactions = service.loadReactions();
      expect(reactions).toBeInstanceOf(Map);
      expect(reactions.size).toBe(0);
    });
  });
});
