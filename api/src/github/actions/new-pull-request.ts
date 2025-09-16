import { Injectable, NotFoundException } from '@nestjs/common';
import { ActionOptions, ServicesCredentials, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ActionInterface, ActionAbstract, Option } from '../../types';
import { Octokit } from '@octokit/core';
import { ServicesService } from '../../services/services.service';
import { GithubService } from '../github.service';

@Injectable()
export class NewPullRequest extends ActionAbstract implements ActionInterface {
  constructor(prisma: PrismaService) {
    super(prisma, 'New-Pull-Request', 'New Pull Request Action', {
      user: 'The organisation or user who owns the repo.',
      repo: 'the repo to check',
    });
  }

  async executePreloader(
    userCredentials: ServicesCredentials,
    options: Option<{ [key: string]: string }>,
    ...data: any[]
  ): Promise<boolean> {
    if (
      !options['user'] ||
      !options['repo'] ||
      !data[0].data['automationId'] ||
      !data[0].data['services'] ||
      !data[0].data['user'] ||
      !userCredentials ||
      !userCredentials.credentials
    ) {
      return false;
    }

    const services: ServicesService = data[0].data['services'];
    const user: User = <User>data[0].data['user'];
    const githubService: GithubService = <GithubService>(
      services.services.get('Github')
    );
    const isConnected = githubService.getIsConnected(user);

    if (!isConnected) return false;

    return true;
  }

  async execute(
    userCredentials: ServicesCredentials,
    options: Option<{ [key: string]: string }>,
    ...data: any[]
  ): Promise<{
    success: boolean;
    runReaction: boolean;
    data?: any;
  }> {
    if (!data[0]['automationId'] || !data[0]['user'])
      return {
        success: false,
        runReaction: false,
        data: {},
      };

    const octokit = new Octokit({
      auth: userCredentials.credentials,
    });

    try {
      const response = await octokit.request(
        'GET /repos/{owner}/{repo}/pulls',
        {
          owner: options['user'],
          repo: options['repo'],
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        },
      );

      if (response.status != 200)
        return {
          success: false,
          runReaction: false,
          data: {},
        };

      const automationHistory = await this.prisma.automationHistory.findFirst({
        where: {
          uuid:
            data[0]['automationId'].toString() +
            '-' +
            data[0]['user'].id.toString(),
        },
      });
      if (!automationHistory)
        return {
          success: false,
          runReaction: false,
          data: {},
        };

      if (response.data.length != 0) {
        let lastPull = null;

        response.data.forEach((pull) => {
          if (
            new Date(pull.created_at) > new Date(automationHistory.updatedAt) &&
            (!lastPull ||
              new Date(pull.created_at) > new Date(lastPull.created_at))
          )
            lastPull = pull;
        });

        if (lastPull)
          return {
            success: true,
            runReaction: true,
            data: {
              object: 'New Pull Request',
              message: `On repo: ${options['repo']}\nowned by: ${options['user']}
              Pull Request name: ${lastPull.title}\nauthor: ${lastPull.user.login}`,
            },
          };
      }
    } catch (error) {
      console.error('New Pull execute, Erreur de requête :', error);
      return {
        success: false,
        runReaction: false,
        data: {},
      };
    }
    return {
      success: true,
      runReaction: false,
      data: {},
    };
  }
}
