import { Inject, Injectable } from '@nestjs/common';
import { Service } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ActionInterface, ReactionInterface, ServiceProvider } from '../types';

@Injectable()
export class WeatherService implements ServiceProvider {
  weather: Service | undefined;
  name = 'WeatherApi';
  description = '';
  registeredActions: Map<number, ActionInterface> = new Map<
    number,
    ActionInterface
  >();
  registeredReactions: Map<number, ReactionInterface> = new Map<
    number,
    ReactionInterface
  >();

  constructor(
    private prisma: PrismaService,
    @Inject('Actions') private actions: ActionInterface[],
  ) {}

  //===========//
  //  SERVICE  //
  //===========//

  async saveService() {
    this.weather = await this.prisma.service.upsert({
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
    if (!this.weather) throw new Error(`${this.name} service not saved`);

    console.log(`${this.name} Actions:`);
    const promises = this.actions.map(async (action: ActionInterface) => {
      const id = await action.saveAction(this.weather.id);
      this.registeredActions.set(id, action);
    });
    await Promise.all(promises);
    return this.registeredActions;
  }

  loadActions(): Map<number, ActionInterface> {
    return this.registeredActions;
  }

  //=============//
  //  REACTIONS  //
  //=============//

  async saveReactions(): Promise<Map<number, ReactionInterface>> {
    return this.registeredReactions;
  }

  loadReactions(): Map<number, ReactionInterface> {
    return this.registeredReactions;
  }

  //==================//
  //  AUTHENTICATION  //
  //==================//

  authenticate(): boolean | Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
