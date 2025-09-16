import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ServiceProvider, ReactionInterface, ActionInterface } from '../types';
import { PrismaService } from '../prisma/prisma.service';
import { Service, User } from '@prisma/client';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Octokit } from '@octokit/core';

@Injectable()
export class GithubService implements ServiceProvider {
  github: Service | undefined;
  name = 'Github';
  description = 'Github Service';
  registeredActions: Map<number, ActionInterface> = new Map<
    number,
    ActionInterface
  >();
  registeredReactions: Map<number, ReactionInterface> = new Map<
    number,
    ReactionInterface
  >();
  stateRandomStrings: Map<number, string> = new Map<number, string>();

  constructor(
    private readonly prisma: PrismaService,
    @Inject('Actions') private actions: ActionInterface[],
    @Inject('Reactions') private reactions: ReactionInterface[],
  ) {}

  //===========//
  //  SERVICE  //
  //===========//

  async saveService() {
    this.github = await this.prisma.service.upsert({
      where: { name: this.name },
      update: {
        isOAuth: true,
      },
      create: {
        name: this.name,
        description: this.description,
        isOAuth: true,
      },
    });
    console.log(`${this.name} saved`);
  }

  //===========//
  //  ACTIONS  //
  //===========//

  async saveActions() {
    if (!this.github) throw new Error('Github service not saved');

    console.log('Github Actions:');
    const promises = this.actions.map(async (action: ActionInterface) => {
      const id = await action.saveAction(this.github.id);
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
    if (!this.github) throw new Error('Github service not saved');

    console.log('Github Reactions:');
    const promises = this.reactions.map(async (reaction: ReactionInterface) => {
      const id = await reaction.saveReaction(this.github.id);
      this.registeredReactions.set(id, reaction);
    });
    await Promise.all(promises);

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

  async getIsConnected(user: User) {
    const actionServiceCreds = await this.prisma.servicesCredentials.findFirst({
      where: {
        userId: user.id,
        serviceId: this.github.id,
      },
    });

    if (!actionServiceCreds) return false;

    const octokit = new Octokit({
      auth: actionServiceCreds.credentials,
    });

    try {
      const response = await octokit.request('GET /user', {
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      if (response.status != 200) return false;
    } catch (error) {
      console.error('getIsConnected github, Request Error :', error);
      return false;
    }
    return true;
  }

  getAuthData(user: User) {
    this.stateRandomStrings.set(user.id, randomStringGenerator());

    return {
      link: 'https://github.com/login/oauth/authorize',
      clientId: process.env.GITHUB_CLIENT_ID,
      scope: 'repo user read:org',
      state: this.stateRandomStrings.get(user.id),
    };
  }

  async applyOAuth(user: User, body: any): Promise<any> {
    const newBody = {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: body.code,
    };

    const resp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: JSON.stringify(newBody),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!resp) throw new NotFoundException('Error while fetching token');
    const respBody = await resp.json();

    const today = new Date();
    const sixHoursFromNow = new Date(today);
    sixHoursFromNow.setHours(today.getHours() + 6);

    const credentials = await this.prisma.servicesCredentials.upsert({
      where: {
        serviceId_userId: {
          serviceId: this.github.id,
          userId: user.id,
        },
      },
      update: {
        validUntil: sixHoursFromNow,
        credentials: respBody.access_token,
      },
      create: {
        validUntil: sixHoursFromNow,
        credentials: respBody.access_token,
        serviceId: this.github.id,
        userId: user.id,
      },
    });

    if (!credentials)
      throw new NotFoundException('Error while saving credentials');

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        serviceCredentials: {
          connect: {
            id: credentials.id,
          },
        },
      },
    });

    if (updatedUser)
      return {
        message: 'Success',
        status: 200,
      };
    else throw new NotFoundException('Error while saving credentials in user');
  }
}
