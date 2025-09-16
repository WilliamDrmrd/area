import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Reaction, ReactionOptions, User } from '@prisma/client';

@Injectable()
export class ReactionsOptionsService {
  constructor(private prisma: PrismaService) {}

  async create(
    key: string,
    value: string,
    user: User,
    reaction: Reaction,
    automationId?: number,
  ): Promise<ReactionOptions> {
    const automation = automationId
      ? {
          Automation: {
            connect: {
              id: automationId,
            },
          },
        }
      : undefined;
    return this.prisma.reactionOptions.create({
      data: {
        key,
        value,
        user: {
          connect: {
            id: user.id,
          },
        },
        reaction: {
          connect: {
            id: reaction.id,
          },
        },
        ...automation,
      },
    });
  }

  async update(id: number, value: string): Promise<ReactionOptions> {
    return this.prisma.reactionOptions.update({
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
    reaction: Reaction,
    automationId?: number,
  ): Promise<ReactionOptions> {
    const exists = await this.prisma.reactionOptions.findFirst({
      where: {
        key,
        reactionId: reaction.id,
        userId: user.id,
        automationId,
      },
    });

    return exists
      ? this.update(exists.id, value)
      : this.create(key, value, user, reaction, automationId);
  }
}
