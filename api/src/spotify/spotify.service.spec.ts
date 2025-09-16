import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyService } from './spotify.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { ActionInterface } from '../types';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('SpotifyService', () => {
  let service: SpotifyService;
  let mockPrismaService: Partial<PrismaService>;
  let mockActions: ActionInterface[];

  beforeEach(async () => {
    mockActions = [
      {
        saveAction: jest.fn(() => Promise.resolve(1)),
      } as any,
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpotifyService,
        {
          provide: PrismaService,
          useValue: {
            service: {
              upsert: jest.fn(),
            },
            servicesCredentials: {
              upsert: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
            },
            user: {
              update: jest.fn(),
            },
          },
        },
        {
          provide: 'Actions',
          useValue: mockActions,
        },
      ],
    }).compile();

    service = module.get<SpotifyService>(SpotifyService);
    mockPrismaService = module.get<PrismaService>(PrismaService);
    fetchMock.resetMocks();
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
      service.spotify = { id: 1 } as any;
      const result = await service.saveActions();
      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(mockActions.length);
      expect(mockActions[0].saveAction).toHaveBeenCalledWith(1);
    });

    it('should throw an error if Spotify service is not saved', async () => {
      service.spotify = undefined;
      await expect(service.saveActions()).rejects.toThrow(
        'Spotify service not saved',
      );
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
    it('should return an empty Map', async () => {
      const result = await service.saveReactions();
      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(0);
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

  describe('getIsConnected', () => {
    it('should return true if user is connected', async () => {
      const user = { id: 1 } as User;
      const mockServiceCredentials = { credentials: 'mockCredentials' };

      jest
        .spyOn(mockPrismaService.servicesCredentials, 'findFirst')
        .mockResolvedValue(mockServiceCredentials as any);

      service.spotify = { id: 1 } as any;

      fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });

      const isConnected = await service.getIsConnected(user);

      expect(isConnected).toBe(true);
    });

    it('should return false if user is not connected', async () => {
      const user = { id: 1 } as User;

      service.spotify = { id: 1 } as any;
      jest
        .spyOn(mockPrismaService.servicesCredentials, 'findFirst')
        .mockResolvedValue(null);

      const isConnected = await service.getIsConnected(user);

      expect(isConnected).toBe(false);
    });
  });

  describe('getAuthData', () => {
    it('should return the auth data with a state', () => {
      const user = { id: 1 } as User;

      const authData = service.getAuthData(user);

      expect(authData).toHaveProperty('link');
      expect(authData).toHaveProperty('clientId');
      expect(authData).toHaveProperty('scope');
      expect(authData).toHaveProperty('state');
      expect(authData).toHaveProperty('responseType');
      expect(authData).toHaveProperty('redirectUri');
      expect(service.stateRandomStrings.has(user.id)).toBe(true);
    });
  });

  describe('applyOAuth', () => {
    it('should save user credentials and return success', async () => {
      const user = { id: 1 } as User;
      const body = { code: 'mockCode', redirectUri: 'mockRedirectUri' };
      const mockResponse = {
        access_token: 'mockAccessToken',
        refresh_token: 'mockRefreshToken',
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      jest
        .spyOn(mockPrismaService.servicesCredentials, 'upsert')
        .mockResolvedValue({ id: 1 } as any);

      service.spotify = { id: 1 } as any;
      jest
        .spyOn(mockPrismaService.user, 'update')
        .mockResolvedValue({ id: user.id } as any);

      const result = await service.applyOAuth(user, body);

      expect(result).toEqual({
        message: 'Success',
        status: 200,
      });
    });
  });

  describe('refreshCredentials', () => {
    it('should refresh credentials successfully', async () => {
      const id = 1;
      const mockServiceCredentials = {
        id: 1,
        refreshToken: 'mockRefreshToken',
      };

      const mockResponse = { access_token: 'newAccessToken' };

      jest
        .spyOn(mockPrismaService.servicesCredentials, 'findFirst')
        .mockResolvedValue(mockServiceCredentials as any);

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      service.spotify = { id: 1 } as any;
      jest
        .spyOn(mockPrismaService.servicesCredentials, 'update')
        .mockResolvedValue({} as any);

      const result = await service.refreshCredentials(id);

      expect(result).not.toBe(false);
    });
  });
});
