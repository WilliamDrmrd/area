import { Injectable } from '@nestjs/common';
import { ServiceProvider, ReactionInterface, ActionInterface } from '../types';
import { PrismaService } from '../prisma/prisma.service';
import { Service } from '@prisma/client';
import { SendMessage } from './reactions/send-message';

@Injectable()
export class SlackService implements ServiceProvider {
  slack: Service | undefined;
  name = 'Slack';
  description = 'Slack Service';
  registeredActions: Map<number, ActionInterface> = new Map<
    number,
    ActionInterface
  >();
  registeredReactions: Map<number, ReactionInterface> = new Map<
    number,
    ReactionInterface
  >();

  constructor(
    private readonly prisma: PrismaService,
    private sendMessage: SendMessage,
  ) {}

  //===========//
  //  SERVICE  //
  //===========//

  async saveService() {
    this.slack = await this.prisma.service.upsert({
      where: { name: this.name },
      update: {},
      create: {
        name: this.name,
        description: this.description,
      },
    });
    console.log(`${this.name} saved`);
  }

  //===========//
  //  ACTIONS  //
  //===========//

  async saveActions() {
    return this.registeredActions;
  }

  loadActions(): Map<number, ActionInterface> {
    return this.registeredActions;
  }

  //=============//
  //  REACTIONS  //
  //=============//

  async saveReactions(): Promise<Map<number, ReactionInterface>> {
    console.log('Slack Reactions:');
    const id = await this.sendMessage.saveReaction(this.slack.id);
    this.registeredReactions.set(id, this.sendMessage);
    return this.registeredReactions;
  }

  loadReactions(): Map<number, ReactionInterface> {
    return this.registeredReactions;
  }

  //==================//
  //  AUTHENTICATION  //
  //==================//

  authenticate(): boolean | Promise<boolean> {
    // throw new Error('Method not implemented.');
    return true;
  }
}
