import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { PrismaService } from '../prisma/prisma.service';
import { ActionInterface } from '../types';

describe('WeatherService', () => {
  let service: WeatherService;
  let mockPrismaService: Partial<PrismaService>;
  const mockActions: ActionInterface[] = [
    {
      saveAction: () => Promise.resolve(1),
    } as any,
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: PrismaService,
          useValue: {
            service: {
              upsert: jest.fn(),
            },
          },
        },
        {
          provide: 'Actions',
          useValue: mockActions,
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    mockPrismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mockPrismaService).toBeDefined();
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
    const log = console.log;
    beforeAll(() => {
      console.log = jest.fn();
    });
    afterAll(() => {
      console.log = log;
    });
    it('should save actions', async () => {
      service.weather = { id: 1 } as any;
      const result = await service.saveActions();
      expect(result).toBeInstanceOf(Map);
      // Adjust based on the number of mockActions
      expect(result.size).toBe(1);
    });

    it('should throw an error (service not saved)', async () => {
      service.weather = undefined;
      await expect(service.saveActions()).rejects.toThrow(Error);
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
    it('should return saved reactions', async () => {
      const reactions = await service.saveReactions();
      expect(reactions).toBeInstanceOf(Map);
      expect(reactions.size).toBe(0);
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
    it('should throw an error (method not implemented)', () => {
      expect(() => service.authenticate()).toThrowError(
        'Method not implemented.',
      );
    });
  });
});
