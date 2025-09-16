import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActionOptions, User, Action } from '@prisma/client';

@Injectable()
export class ActionsOptionsService {
  constructor(private prisma: PrismaService) {}

  async create(
    key: string,
    value: string,
    user: User,
    action: Action,
    automationId?: number,
  ): Promise<ActionOptions> {
    const automation = automationId
      ? {
          Automation: {
            connect: {
              id: automationId,
            },
          },
        }
      : undefined;
    return this.prisma.actionOptions.create({
      data: {
        key,
        value,
        user: {
          connect: {
            id: user.id,
          },
        },
        action: {
          connect: {
            id: action.id,
          },
        },
        ...automation,
      },
    });
  }

  async update(id: number, value: string): Promise<ActionOptions> {
    return this.prisma.actionOptions.update({
      where: {
        id,
      },
      data: {
        value,
      },
    });
  }

  async createOrUpdate(
    key: string,
    value: string,
    user: User,
    action: Action,
    automationId?: number,
  ): Promise<ActionOptions> {
    const exists = await this.prisma.actionOptions.findFirst({
      where: {
        key,
        actionId: action.id,
        userId: user.id,
      },
    });

    return exists
      ? this.update(exists.id, value)
      : this.create(key, value, user, action, automationId);
  }
}
