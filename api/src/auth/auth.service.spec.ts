import * as argon from 'argon2';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import SendEmail from '../email-js/reactions/send-email';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let sendEmail: SendEmail;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        JwtService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        SendEmail,
        {
          provide: SendEmail,
          useValue: {
            confirmationMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    sendEmail = module.get<SendEmail>(SendEmail);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    let findUniqueSpy: any;
    it('should throw an error if user does not exist', async () => {
      findUniqueSpy = jest.spyOn(prismaService.user, 'findUnique');
      findUniqueSpy.mockResolvedValueOnce(null);

      await expect(
        service.login({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(ForbiddenException);

      findUniqueSpy.mockRestore();
    });

    it('should throw an error if the password is not correct', async () => {
      const hash = await argon.hash('aled');

      findUniqueSpy = jest.spyOn(prismaService.user, 'findUnique');
      findUniqueSpy.mockResolvedValueOnce({
        id: 1,
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'username',
        lastName: 'Last',
        firstName: 'First',
        uuid: 'uuid',
        isOauth: false,
        isActivated: true,
        password: hash,
      });

      await expect(
        service.login({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(ForbiddenException);

      findUniqueSpy.mockRestore();
    });

    it('should throw an error if user is oauth and try email, password login', async () => {
      findUniqueSpy = jest.spyOn(prismaService.user, 'findUnique');
      findUniqueSpy.mockResolvedValueOnce({
        id: 1,
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'username',
        lastName: 'Last',
        firstName: 'First',
        uuid: 'uuid',
        isOauth: true,
        isActivated: true,
        token: 'token',
        password: null,
      });

      await expect(
        service.login({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(ForbiddenException);

      findUniqueSpy.mockRestore();
    });

    it('should return a jwt token', async () => {
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('token');

      const hash = await argon.hash('password');
      findUniqueSpy = jest.spyOn(prismaService.user, 'findUnique');
      findUniqueSpy.mockResolvedValueOnce({
        id: 1,
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'username',
        lastName: 'Last',
        firstName: 'First',
        uuid: 'uuid',
        isOauth: false,
        isActivated: true,
        token: null,
        password: hash,
      } as any);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result.access_token).toBe('token');
      expect(findUniqueSpy).toBeCalledTimes(1);
      expect(findUniqueSpy).toBeCalledWith({
        where: {
          email: 'test@example.com',
        },
      });

      findUniqueSpy.mockRestore();
    });
  });

  describe('oauthLogin', () => {
    let findUniqueSpy: any;
    let signTokenSpy: any;

    it('should throw an error if user is not oauth', async () => {
      findUniqueSpy = jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce({
          id: 1,
          email: 'oauth@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          username: 'username',
          lastName: 'Last',
          firstName: 'First',
          uuid: 'uuid',
          isOauth: false,
          isActivated: true,
          token: 'token',
          password: null,
        });

      await expect(
        service.oauthLogin({
          email: 'oauth@example.com',
          firstname: 'he',
          lastname: 'gest',
          token: 'token',
        }),
      ).rejects.toThrow(ForbiddenException);

      findUniqueSpy.mockRestore();
    });

    it('should return an access token for valid oauth users', async () => {
      signTokenSpy = jest
        .spyOn(service, 'signToken')
        .mockResolvedValueOnce('token');
      findUniqueSpy = jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce({
          id: 1,
          email: 'oauth@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          username: 'username',
          lastName: 'Last',
          firstName: 'First',
          uuid: 'uuid',
          isOauth: true,
          isActivated: true,
          token: 'token',
          password: null,
        });

      const result = await service.oauthLogin({
        email: 'oauth@example.com',
        firstname: 'he',
        lastname: 'gest',
        token: 'token',
      });

      expect(result.access_token).toBe('token');

      signTokenSpy.mockRestore();
      findUniqueSpy.mockRestore();
    });
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const tokenSpy = jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce('token');
      const createSpy = jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValueOnce({
          id: 1,
          email: 'test@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          username: 'username',
          lastName: 'Last',
          firstName: 'First',
          uuid: 'uuid',
          isOauth: false,
          isActivated: true,
          token: 'token',
          password: 'password',
        });

      const data = {
        email: 'test@example.com',
        password: 'password',
        username: 'username',
        firstname: 'First',
        lastname: 'Last',
      };
      const result = await service.register(data);

      expect(result.access_token).toBeTruthy();
      expect(jest.spyOn(sendEmail, 'confirmationMail').mock.calls.length).toBe(
        1,
      );
      const firstName = data.firstname;
      const lastName = data.lastname;

      delete data.firstname;
      delete data.lastname;
      delete data.password;
      expect(createSpy).toBeCalledTimes(1);
      expect(createSpy).toBeCalledWith({
        data: {
          ...data,
          firstName,
          lastName,
          uuid: 'a29475f7-a63a-5731-b62e-bd9aeb6106b6',
          password: createSpy.mock.calls[0][0].data.password,
        },
      });
      expect(tokenSpy).toBeCalledTimes(1);
    });

    it('should successfully register a user', async () => {
      jest.spyOn(prismaService.user, 'create').mockResolvedValueOnce(null);

      const data = {
        email: 'test@example.com',
        password: 'password',
        username: 'username',
        firstname: 'First',
        lastname: 'Last',
      };
      expect(service.register(data)).rejects.toThrow(ForbiddenException);
    });

    it('should successfully register a user', async () => {
      jest.spyOn(prismaService.user, 'create').mockImplementationOnce(() => {
        throw new PrismaClientKnownRequestError('test', {
          code: 'P2002',
          clientVersion: '2.0.0',
        });
      });

      const data = {
        email: 'test@example.com',
        password: 'password',
        username: 'username',
        firstname: 'First',
        lastname: 'Last',
      };
      expect(service.register(data)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('oauthRegister', () => {
    let signTokenSpy: any;
    let createSpy: any;

    it('should successfully register an oauth user', async () => {
      signTokenSpy = jest
        .spyOn(service, 'signToken')
        .mockResolvedValueOnce('token');
      createSpy = jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValueOnce({
          id: 1,
          email: 'oauth@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          password: null,
          username: 'first.l',
          uuid: 'uuid',
          firstName: 'First',
          lastName: 'Last',
          token: 'token',
          isOauth: true,
          isActivated: true,
        });

      const data = {
        email: 'oauth@example.com',
        firstname: 'First',
        lastname: 'Last',
        token: 'token',
      };

      const result = await service.oauthRegister(data);

      expect(result.access_token).toBe('token');
      expect(createSpy).toBeCalledTimes(1);

      signTokenSpy.mockRestore();
      createSpy.mockRestore();
    });

    it('should throw ForbiddenException if email already exists', async () => {
      jest.spyOn(prismaService.user, 'create').mockImplementationOnce(() => {
        throw new PrismaClientKnownRequestError('Email already exists', {
          code: 'P2002',
          clientVersion: '2.0.0',
        });
      });

      const data = {
        email: 'oauth@example.com',
        firstname: 'First',
        lastname: 'Last',
        token: 'token',
      };

      await expect(service.oauthRegister(data)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.oauthRegister(data)).rejects.toHaveProperty(
        'message',
        'Email already exists',
      );
    });

    it('should propagate the error if it is not a known Prisma error', async () => {
      const unknownError = new Error('Unknown error');
      jest
        .spyOn(prismaService.user, 'create')
        .mockRejectedValueOnce(unknownError);

      const data = {
        email: 'oauth@example.com',
        firstname: 'First',
        lastname: 'Last',
        token: 'token',
      };

      await expect(service.oauthRegister(data)).rejects.toThrow(unknownError);
    });
  });

  describe('activateAccount', () => {
    it('should throw an error if user does not exist', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);
      await expect(service.activateAccount('uuid')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if user is already activated', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce({ isActivated: true } as any);
      jest.spyOn(prismaService.user, 'update').mockResolvedValueOnce(null);
      await expect(service.activateAccount('uuid')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should activate the account', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce({
        isActivated: false,
      } as any);
      jest.spyOn(prismaService.user, 'update').mockResolvedValueOnce({
        isActivated: true,
      } as any);
      const result = await service.activateAccount('uuid');
      expect(result).toEqual({ message: 'Account activated' });
    });
  });
});
