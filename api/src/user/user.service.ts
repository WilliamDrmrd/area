import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessage } from '../slack/reactions/send-message';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(paramUser: User) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: paramUser.id,
      },
      include: {
        serviceCredentials: true,
        automations: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    delete user.password;
    return user;
  }
}
