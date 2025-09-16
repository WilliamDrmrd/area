import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { PrismaService } from '../prisma/prisma.service';
import { ActionInterface, ReactionInterface } from '../types';

describe('GithubService', () => {
  let service: GithubService;
  let mockPrismaService: Partial<PrismaService>;
  const mockActions: ActionInterface[] = [
    {
      saveAction: () => Promise.resolve(1),
    } as any,
  ];
  const mockReactions: ReactionInterface[] = [
    {
      saveReaction: () => Promise.resolve(1),
    } as any,
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GithubService,
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
        {
          provide: 'Reactions',
          useValue: mockReactions,
        },
      ],
    }).compile();

    service = module.get<GithubService>(GithubService);
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
      service.github = { id: 1 } as any;
      const result = await service.saveActions();
      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(1);
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
      service.github = { id: 1 } as any;
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
    it('should throw an error (method not implemented)', () => {
      expect(() => service.authenticate()).toThrowError(
        'Method not implemented.',
      );
    });
  });
});
