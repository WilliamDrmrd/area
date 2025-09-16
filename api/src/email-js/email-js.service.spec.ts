import { Test, TestingModule } from '@nestjs/testing';
import { EmailJsService } from './email-js.service';
import { PrismaService } from '../prisma/prisma.service';
import { SendEmail } from './reactions/send-email';

describe('EmailJsService', () => {
  let service: EmailJsService;
  let mockPrismaService: Partial<PrismaService>;
  let mockSendEmail: Partial<SendEmail>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailJsService,
        {
          provide: PrismaService,
          useValue: {
            service: {
              upsert: jest.fn(),
            },
          },
        },
        {
          provide: SendEmail,
          useValue: {
            saveReaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmailJsService>(EmailJsService);
    mockPrismaService = module.get<PrismaService>(PrismaService);
    mockSendEmail = module.get<SendEmail>(SendEmail);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockPrismaService).toBeDefined();
    expect(mockSendEmail).toBeDefined();
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
      service.emailjs = { id: 1 } as any;
      const result = await service.saveReactions();
      expect(mockSendEmail.saveReaction).toHaveBeenCalled();
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
