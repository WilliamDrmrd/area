import { ActionsOptionsService } from '../action-reaction-options/actions-options.service';
import { ReactionsOptionsService } from '../action-reaction-options/reactions-options.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAutomationDto, SubscribeAutomationDto } from './dto';
import {
  Action,
  ActionOptions,
  Automation,
  Reaction,
  ReactionOptions,
  User,
} from '@prisma/client';
import { ServicesService } from '../services/services.service';
import { ActionInterface, ReactionInterface } from '../types';
import { TasksService } from '../tasks/tasks.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class AutomationAlreadyExistsException extends Error {
  constructor(name: string) {
    super(`Automation ${name} already exists`);
  }
}

const data = {
  id: true,
  name: true,
  description: true,
};

@Injectable()
export class AutomationService implements OnApplicationBootstrap {
  constructor(
    private prisma: PrismaService,
    private services: ServicesService,
    private actionsOptions: ActionsOptionsService,
    private reactionsOptions: ReactionsOptionsService,
    private tasksService: TasksService,
  ) {}

  async onApplicationBootstrap() {
    this.services.getInitializationEmitter().on('initialized', async () => {
      await this.restartCrons();
    });
  }

  async restartCrons() {
    const users = await this.prisma.user.findMany({
      include: {
        subscribedAutomations: true,
      },
    });
    const usersWithAutomations = users.filter(
      (user) => user.subscribedAutomations && user.subscribedAutomations.length > 0,
    );

    usersWithAutomations.forEach((user) =>
      user.subscribedAutomations.forEach((automation) =>
        this.reSubscribeToAutomation(automation.id, user),
      ),
    );
  }

  async getAutomation(id: number): Promise<Automation> {
    const automation = await this.prisma.automation.findUnique({
      where: { id },
      include: {
        action: {
          select: {
            ...data,
            additionalFields: true,
          },
        },
        reaction: {
          select: {
            ...data,
            additionalFields: true,
          },
        },
        services: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!automation)
      throw new NotFoundException("This automation doesn't exist");
    return automation;
  }

  async getAutomations(user: User): Promise<Automation[]> {
    const automation = await this.prisma.automation.findMany({
      where: {
        OR: [{ creatorID: user.id }, { creatorID: null }],
      },
      include: {
        action: {
          select: data,
        },
        reaction: {
          select: data,
        },
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
        services: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return automation;
  }

  async deleteAutomation(id: number) {
    try {
      const users = await this.prisma.automation.findUnique({
        where: { id },
        include: {
          subscribedUsers: true,
        },
      });
      users.subscribedUsers.forEach((user) => {
        try {
          this.tasksService.removeCron(id, user.id);
          console.log(`removed cron ${this.tasksService.cronId(id, user.id)}`);
        } catch (e) {}
      });
      await this.prisma.automationHistory.deleteMany({
        where: {
          automationId: id,
        },
      });
      const aut = await this.prisma.automation.delete({
        where: {
          id,
        },
      });
      return {
        automation: aut,
        message: 'You have deleted an automation',
      };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025')
          throw new NotFoundException("This automation doesn't exist");
      }
      throw e;
    }
  }

  async createOrFail(
    dto: CreateAutomationDto,
    action: Action,
    reaction: Reaction,
    user: User,
  ) {
    const automation = await this.prisma.automation.findFirst({
      where: {
        name: dto.name,
        actionId: dto.actionId,
        reactionId: dto.reactionId,
        creatorID: user.id,
      },
    });
    if (automation)
      throw new AutomationAlreadyExistsException('Automation already exists');
    return this.prisma.automation.create({
      data: {
        name: dto.name,
        description: dto.description,
        action: {
          connect: {
            id: action.id,
          },
        },
        reaction: {
          connect: {
            id: reaction.id,
          },
        },
        creator: {
          connect: {
            id: user.id,
          },
        },
        services: {
          connect: [
            action.serviceId ? { id: action.serviceId } : undefined,
            reaction.serviceId ? { id: reaction.serviceId } : undefined,
          ],
        },
      },
    });
  }

  async createAutomation(user: User, dto: CreateAutomationDto) {
    const action = this.services.getAction(dto.actionId);
    const reaction = this.services.getReaction(dto.reactionId);

    try {
      const automation = await this.createOrFail(
        dto,
        action.action,
        reaction.reaction,
        user,
      );
      return {
        message: `You have created a new automation ${automation.name}`,
        status: 200,
      };
    } catch (e) {
      if (e instanceof AutomationAlreadyExistsException) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  async handleOptions(
    action: Action,
    reaction: Reaction,
    dto: SubscribeAutomationDto,
    user: User,
    automationId?: number,
  ): Promise<{
    actionOptions: ActionOptions[];
    reactionsOptions: ReactionOptions[];
  }> {
    let error = false;
    const errors = {
      actionError: [],
      reactionError: [],
    };
    const actionOptions: ActionOptions[] = [];
    const reactionsOptions: ReactionOptions[] = [];

    if (action.hasOptions) {
      const actionOptionsFields = await JSON.parse(
        JSON.stringify(action.additionalFields),
      );
      for (const key in actionOptionsFields) {
        if (!dto.actionAdditionalFields || !dto.actionAdditionalFields[key]) {
          errors.actionError.push(
            `Fill ${key} field with ${actionOptionsFields[key]}`,
          );
          error = true;
        } else {
          actionOptions.push(
            await this.actionsOptions.createOrUpdate(
              key,
              dto.actionAdditionalFields[key],
              user,
              action,
              automationId,
            ),
          );
        }
      }
    }

    if (reaction.hasOptions) {
      const reactionOptionsFields = JSON.parse(
        JSON.stringify(reaction.additionalFields),
      );
      for (const key in reactionOptionsFields) {
        if (
          !dto.reactionAdditionalFields ||
          !dto.reactionAdditionalFields[key]
        ) {
          errors.reactionError.push(
            `Fill ${key} field with ${reactionOptionsFields[key]}`,
          );
          error = true;
        } else {
          reactionsOptions.push(
            await this.reactionsOptions.createOrUpdate(
              key,
              dto.reactionAdditionalFields[key],
              user,
              reaction,
              automationId,
            ),
          );
        }
      }
    }
    if (error) throw new BadRequestException(errors);

    return {
      actionOptions,
      reactionsOptions,
    };
  }

  async makeCallback(
    user: User,
    action: ActionInterface,
    reaction: ReactionInterface,
    automationId: number,
    cronId?: string,
  ) {
    const actionServiceCreds = await this.prisma.servicesCredentials.findFirst({
      where: {
        userId: user.id,
        serviceId: action.action.serviceId,
      },
    });
    const reactionServiceCreds =
      await this.prisma.servicesCredentials.findFirst({
        where: {
          userId: user.id,
          serviceId: reaction.reaction.serviceId,
        },
      });
    const options = await this.prisma.automation.findUnique({
      where: {
        id: automationId,
      },
      include: {
        actionOptions: true,
        reactionOptions: true,
      },
    });
    const aOptions: { [key: string]: string } = {};
    const rOptions: { [key: string]: string } = {};
    options.actionOptions.forEach((option: any) => {
      aOptions[option.key] = option.value;
    });
    options.reactionOptions.forEach((option: any) => {
      rOptions[option.key] = option.value;
    });

    return async () => {
      console.log(`Executing callback ${cronId}`);
      try {
        const actionResult = await action.execute(
          actionServiceCreds,
          aOptions,
          {
            cronId: cronId,
            user: user,
            automationId: automationId,
          },
        );
        if (actionResult.success == false) {
          throw new InternalServerErrorException(
            `Something went wrong while executing action ${action.action.name}`,
          );
        } else if (actionResult.runReaction) {
          await reaction.execute(reactionServiceCreds, rOptions, actionResult);
        } else {
          console.log(`No reaction needed for ${cronId}`);
        }
        await this.prisma.automationHistory.update({
          where: {
            uuid: cronId,
          },
          data: {
            updatedAt: new Date(),
          },
        });
      } catch (e) {
        console.log(`Error while executing callback ${cronId}`);
        console.error(e);
      }
    };
  }

  async subscribeToAutomation(
    id: number,
    user: User,
    dto: SubscribeAutomationDto,
  ) {
    const automation = await this.prisma.automation.findUnique({
      where: { id },
    });

    if (!automation)
      throw new NotFoundException("This automation doesn't exist");

    const action = this.services.getAction(automation.actionId);
    const reaction = this.services.getReaction(automation.reactionId);

    await this.handleOptions(
      action.action,
      reaction.reaction,
      dto,
      user,
      automation.id,
    );

    const actionServiceCreds = await this.prisma.servicesCredentials.findFirst({
      where: {
        userId: user.id,
        serviceId: action.action.serviceId,
      },
    });
    const reactionServiceCreds =
      await this.prisma.servicesCredentials.findFirst({
        where: {
          userId: user.id,
          serviceId: reaction.reaction.serviceId,
        },
      });
    const options = await this.prisma.automation.findUnique({
      where: {
        id: automation.id,
      },
      include: {
        actionOptions: true,
        reactionOptions: true,
      },
    });
    const aOptions: { [key: string]: string } = {};
    const rOptions: { [key: string]: string } = {};
    options.actionOptions.forEach((option: any) => {
      aOptions[option.key] = option.value;
    });
    options.reactionOptions.forEach((option: any) => {
      rOptions[option.key] = option.value;
    });

    const preloaderActionStatus = await action.executePreloader(
      actionServiceCreds,
      aOptions,
      {
        data: {
          automationId: automation.id,
          services: this.services,
          user: user,
        },
      },
    );
    const preloaderReactionStatus = await reaction.executePreloader(
      reactionServiceCreds,
      aOptions,
      {
        data: {
          automationId: automation.id,
          services: this.services,
          user: user,
        },
      },
    );

    if (!preloaderActionStatus || !preloaderReactionStatus) {
      // One of the accounts is not connected
      // TODO : automations are not enabled by user !! this must be done and will be noted!

      return {
        message: `Cannot subscribe to automation ${automation.name}. Reason: Preloader failed, you are disconnected from
        one or both of your accounts used by this automation}`,
      };
    }

    const uuid = this.tasksService.cronId(automation.id, user.id);
    const data = {
      uuid: uuid,
      automation: {
        connect: {
          id: automation.id,
        },
      },
      runnedAt: new Date(0),
    };

    await this.prisma.automationHistory.upsert({
      where: {
        uuid,
      },
      create: data,
      update: data,
    });

    const callback = await this.makeCallback(
      user,
      action,
      reaction,
      automation.id,
      uuid,
    );

    this.tasksService.addCron(automation.id, user.id, '5 * * * * *', callback);

    const savedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        subscribedAutomations: {
          connect: {
            id: automation.id,
          },
        },
      },
    });
    if (!savedUser)
      throw new InternalServerErrorException(
        'Something went wrong while subscribing to automation',
      );
    return {
      message: `You have subscribed to automation ${automation.name}`,
    };
  }

  async reSubscribeToAutomation(id: number, user: User) {
    const automation = await this.prisma.automation.findUnique({
      where: { id },
    });

    if (!automation)
      throw new NotFoundException("This automation doesn't exist");

    const action = this.services.getAction(automation.actionId);
    const reaction = this.services.getReaction(automation.reactionId);

    const actionServiceCreds = await this.prisma.servicesCredentials.findFirst({
      where: {
        userId: user.id,
        serviceId: action.action.serviceId,
      },
    });
    const reactionServiceCreds =
      await this.prisma.servicesCredentials.findFirst({
        where: {
          userId: user.id,
          serviceId: reaction.reaction.serviceId,
        },
      });
    const options = await this.prisma.automation.findUnique({
      where: {
        id: automation.id,
      },
      include: {
        actionOptions: true,
        reactionOptions: true,
      },
    });
    const aOptions: { [key: string]: string } = {};
    const rOptions: { [key: string]: string } = {};
    options.actionOptions.forEach((option: any) => {
      aOptions[option.key] = option.value;
    });
    options.reactionOptions.forEach((option: any) => {
      rOptions[option.key] = option.value;
    });

    const preloaderActionStatus = await action.executePreloader(
      actionServiceCreds,
      aOptions,
      {
        data: {
          automationId: automation.id,
          services: this.services,
          user: user,
        },
      },
    );
    const preloaderReactionStatus = await reaction.executePreloader(
      reactionServiceCreds,
      aOptions,
      {
        data: {
          automationId: automation.id,
          services: this.services,
          user: user,
        },
      },
    );

    if (!preloaderActionStatus || !preloaderReactionStatus) {
      //disabling automation
      // TODO : automations are not enabled by user !! this must be done and will be noted!

      const savedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          subscribedAutomations: {
            disconnect: {
              id: id,
            },
          },
        },
      });
      return {
        message: `Unsubscribed from automation ${automation.name}. Reason: Preloader failed, you are disconnected from
        one or both of your accounts used by this automation}`,
      };
    }

    const uuid = this.tasksService.cronId(automation.id, user.id);
    const data = {
      uuid: uuid,
      automation: {
        connect: {
          id: automation.id,
        },
      },
      runnedAt: new Date(),
    };

    await this.prisma.automationHistory.upsert({
      where: {
        uuid,
      },
      create: data,
      update: data,
    });

    const callback = await this.makeCallback(
      user,
      action,
      reaction,
      automation.id,
      uuid,
    );

    this.tasksService.addCron(automation.id, user.id, '5 * * * * *', callback);

    const savedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        subscribedAutomations: {
          connect: {
            id: automation.id,
          },
        },
      },
    });
    if (!savedUser)
      throw new InternalServerErrorException(
        'Something went wrong while subscribing to automation',
      );
    return {
      message: `You have subscribed to automation ${automation.name}`,
    };
  }

  async unsubscribeToAutomation(id: number, user: User) {
    try {
      this.tasksService.removeCron(id, user.id);
    } catch (e) {
      throw new BadRequestException(
        'you are not subscribed to this automation',
      );
    }
    const automation = await this.prisma.automation.findUnique({
      where: { id },
    });
    if (!automation)
      throw new NotFoundException("This automation doesn't exist");
    const savedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        subscribedAutomations: {
          disconnect: {
            id: id,
          },
        },
      },
    });
    await this.prisma.actionOptions.deleteMany({
      where: {
        automationId: id,
        userId: user.id,
      },
    });
    await this.prisma.reactionOptions.deleteMany({
      where: {
        automationId: id,
        userId: user.id,
      },
    });
    if (!savedUser)
      throw new InternalServerErrorException(
        'Something went wrong while unsubscribing to automation',
      );
    console.log(`removed cron ${this.tasksService.cronId(id, user.id)}`);
    return {
      message: `You have unsubscribed to automation ${automation.name}`,
    };
  }

  async getSubscribedAutomations(user: User) {
    const auto = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        subscribedAutomations: true,
      },
    });
    return {
      automations: auto.subscribedAutomations,
    };
  }
}
