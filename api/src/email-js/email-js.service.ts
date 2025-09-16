import { Injectable } from '@nestjs/common';
import { ServiceProvider, ReactionInterface, ActionInterface } from '../types';
import { PrismaService } from '../prisma/prisma.service';
import { Service } from '@prisma/client';
import { SendEmail } from './reactions/send-email';

@Injectable()
export class EmailJsService implements ServiceProvider {
  emailjs: Service | undefined;
  name = 'EmailJS';
  description = 'EmailJS Service';
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
    private sendEmail: SendEmail,
  ) {}

  //===========//
  //  SERVICE  //
  //===========//

  async saveService() {
    this.emailjs = await this.prisma.service.upsert({
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
    console.log('EmailJS Reactions:');
    const id = await this.sendEmail.saveReaction(this.emailjs.id);
    this.registeredReactions.set(id, this.sendEmail);
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
