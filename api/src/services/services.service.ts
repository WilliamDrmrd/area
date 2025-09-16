import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { GithubService } from '../github/github.service';
import { EmailJsService } from '../email-js/email-js.service';
import {
  ActionInterface,
  ReactionInterface,
  Option,
  ServiceProvider,
} from '../types';
import { PrismaService } from '../prisma/prisma.service';
import { Web3isDoingGreatService } from '../web3is-doing-great/web3is-doing-great.service';
import { WeatherService } from '../weather/weather.service';
import { DiscordService } from '../discord/discord.service';
import { SlackService } from '../slack/slack.service';
import { EventEmitter } from 'events';
import { SpotifyService } from '../spotify/spotify.service';

type ServiceActions = Option<Map<number, ActionInterface>>;
type ServiceReactions = Option<Map<number, ReactionInterface>>;
type name = string;

const data = {
  id: true,
  name: true,
  description: true,
};

@Injectable()
export class ServicesService implements OnApplicationBootstrap {
  actions: ServiceActions;
  reactions: ServiceReactions;
  services: Map<name, ServiceProvider>;
  initializationEmitter = new EventEmitter();

  constructor(
    private githubService: GithubService,
    private emailJsService: EmailJsService,
    private web3: Web3isDoingGreatService,
    private weatherService: WeatherService,
    private discordService: DiscordService,
    private slackService: SlackService,
    private spotifyService: SpotifyService,
    private prisma: PrismaService,
  ) {
    this.actions = new Map<number, ActionInterface>();
    this.reactions = new Map<number, ReactionInterface>();
    this.services = new Map<name, ServiceProvider>();

    this.services.set(
      this.githubService.name,
      githubService as ServiceProvider,
    );
    this.services.set(
      this.emailJsService.name,
      emailJsService as ServiceProvider,
    );
    this.services.set(this.web3.name, web3 as ServiceProvider);
    this.services.set(
      this.weatherService.name,
      weatherService as ServiceProvider,
    );
    this.services.set(githubService.name, githubService as ServiceProvider);
    this.services.set(emailJsService.name, emailJsService as ServiceProvider);
    this.services.set(discordService.name, discordService as ServiceProvider);
    this.services.set(slackService.name, slackService as ServiceProvider);
    this.services.set(spotifyService.name, spotifyService as ServiceProvider);
  }

  async onApplicationBootstrap() {
    await this.saveServices();
    this.initializationEmitter.emit('initialized');
  }

  getInitializationEmitter() {
    return this.initializationEmitter;
  }

  async saveServices() {
    const saveToActions = (map: ServiceActions) => {
      map.forEach((action, key) => {
        this.actions.set(key, action);
      });
    };
    const saveToReactions = (map: ServiceReactions) => {
      map.forEach((reaction, key) => {
        this.reactions.set(key, reaction);
      });
    };

    await this.githubService.saveService();
    await this.emailJsService.saveService();
    await this.web3.saveService();
    await this.weatherService.saveService();
    await this.discordService.saveService();
    await this.slackService.saveService();
    await this.spotifyService.saveService();

    // get actions in const
    const githubActions = await this.githubService.saveActions();
    const web3Actions = await this.web3.saveActions();
    const weatherActions = await this.weatherService.saveActions();
    const spotifyActions = await this.spotifyService.saveActions();

    const githubReactions = await this.githubService.saveReactions();
    const mailerReactions = await this.emailJsService.saveReactions();
    const discordReactions = await this.discordService.saveReactions();
    const slackReactions = await this.slackService.saveReactions();

    saveToActions(githubActions);
    saveToActions(web3Actions);
    saveToActions(weatherActions);
    saveToActions(spotifyActions);
    saveToReactions(githubReactions);
    saveToReactions(mailerReactions);
    saveToReactions(discordReactions);
    saveToReactions(slackReactions);

    console.log('\nActions:');
    this.actions.forEach((t, key) => {
      console.log('\t', key, t.name);
    });
    console.log('Reactions:');
    this.reactions.forEach((t, key) => {
      console.log('\t', key, t.name);
    });
  }

  getActions(): ServiceActions {
    return this.actions;
  }

  getAction(id: number): ActionInterface {
    if (!this.actions) throw new Error('Actions not loaded');
    const action = this.actions.get(id);
    if (!action) throw new NotFoundException(`action ${id} not found`);
    return action;
  }

  getReactions(): ServiceReactions {
    return this.reactions;
  }

  getReaction(id: number): ReactionInterface {
    if (!this.reactions) throw new Error('Reactions not loaded');
    const reaction = this.reactions.get(id);
    if (!reaction) throw new NotFoundException(`reaction ${id} not found`);
    return reaction;
  }

  async getServiceAutomations(id: number) {
    const service = await this.prisma.service.findUnique({
      where: { id: id },
    });
    if (!service) throw new NotFoundException(`service ${id} not found`);
    const automations = await this.prisma.service.findUnique({
      where: { id: id },
      select: {
        automations: {
          select: {
            id: true,
            name: true,
            description: true,
            creator: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
    return automations;
  }

  getAboutServices() {
    const areasData = {
      name: true,
      description: true,
    };
    return this.prisma.service.findMany({
      select: {
        name: true,
        actions: {
          select: areasData,
        },
        reactions: {
          select: areasData,
        },
      },
    });
  }

  getServices() {
    const areasData = {
      id: true,
      name: true,
      description: true,
    };
    return this.prisma.service.findMany({
      include: {
        actions: {
          select: areasData,
        },
        reactions: {
          select: areasData,
        },
      },
    });
  }

  async getServiceDb(id: number) {
    const service = await this.prisma.service.findUnique({
      where: { id: id },
      select: {
        actions: {
          select: data,
        },
        reactions: {
          select: data,
        },
        automations: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!service) throw new NotFoundException(`service ${id} not found`);
    return service;
  }

  async getServiceActions(id: number) {
    const service = await this.prisma.service.findUnique({
      where: { id: id },
      select: {
        actions: {
          select: data,
        },
      },
    });
    if (!service) throw new NotFoundException(`service ${id} not found`);
    return service.actions;
  }

  async getServiceReactions(id: number) {
    const service = await this.prisma.service.findUnique({
      where: { id: id },
      select: {
        reactions: {
          select: data,
        },
      },
    });
    if (!service) throw new NotFoundException(`service ${id} not found`);
    return service.reactions;
  }

  getService(name: name): ServiceProvider {
    const service = this.services.get(name);
    if (!service) throw new NotFoundException(`service ${name} not found`);
    return service;
  }
}
