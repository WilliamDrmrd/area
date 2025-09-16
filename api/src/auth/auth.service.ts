import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { v5 as uuidv5 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto, RegisterOauthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import SendEmail from '../email-js/reactions/send-email';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private sendEmail: SendEmail,
  ) {}

  signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET,
    });
  }

  async login(body: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Email or password incorrect');
    }
    if (user.isOauth)
      throw new ForbiddenException(
        "You can't connect with this account through email and password",
      );

    const pwMatch = await argon.verify(user.password, body.password);
    if (!pwMatch) {
      throw new ForbiddenException('Email or password incorrect');
    }

    return { access_token: await this.signToken(user.id, user.email) };
  }

  async oauthLogin(dto: RegisterOauthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      return this.oauthRegister(dto);
    } else if (!user.isOauth)
      throw new ForbiddenException(
        "You can't connect with this account through oauth",
      );

    return { access_token: await this.signToken(user.id, user.email) };
  }

  async register(body: RegisterDto) {
    const hash = await argon.hash(body.password);
    const uuid = uuidv5(body.username + body.email, uuidv5.DNS);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: body.email,
          password: hash,
          username: body.username,
          uuid: uuid,
          firstName: body.firstname,
          lastName: body.lastname,
        },
      });
      if (!user) {
        throw new ForbiddenException('Email already exists');
      }
      this.sendEmail.confirmationMail(user.email, user.username, user.uuid);
      return { access_token: await this.signToken(user.id, user.email) };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw e;
    }
  }

  private makeid(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_!@#$%^&*';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  async oauthRegister(body: RegisterOauthDto) {
    const randomPassword = this.makeid(20);
    const hash = await argon.hash(randomPassword);
    const uuid = uuidv5(body.email, uuidv5.DNS);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: body.email,
          password: hash,
          username: `${body.firstname}.${body.lastname[0].toUpperCase()}`,
          uuid: uuid,
          firstName: body.firstname,
          lastName: body.lastname,
          token: body.token,
          isOauth: true,
          isActivated: true,
        },
      });
      if (!user) {
        throw new ForbiddenException('Email already exists');
      }
      return { access_token: await this.signToken(user.id, user.email) };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw e;
    }
  }

  async activateAccount(uuid: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        uuid,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isActivated: true,
      },
    });
    if (!updatedUser)
      throw new InternalServerErrorException(
        'An error occured while activating your account',
      );
    return { message: 'Account activated' };
  }
}
